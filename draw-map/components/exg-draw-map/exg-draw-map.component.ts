import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { combineLatest, distinctUntilChanged, filter, first, map, Subject, takeUntil } from 'rxjs';

import { DrawFeatureService } from '../../services/draw-feature.service';
import { LeafletService } from '../../../map/services/leaflet.service';
import { PlatformService } from '../../../shared/services/common/platform.service';

import { DrawMapEditDispatchers } from '../../store/draw-map-edit.dispatchers';
import { DrawMapEditSelectors } from '../../store/draw-map-edit.selectors';
import { DrawMapDispatchers } from '../../store/draw-map.dispatchers';
import { DrawMapSelectors } from '../../store/draw-map.selectors';

import { BoundPaddingOptions } from '../../models/bound-padding-options.model';
import { DrawActionType } from '../../models/draw-action-type.enum';
import { DrawError } from '../../models/draw-errors.model';
import { EditSource } from '../../models/edit-source.enum';
import { FeatureType } from '../../models/feature-type.enum';
import { Point } from '../../../map/model/point.model';
import { Polygon } from '../../../map/model/polygone.model';
import { ToolbarAction } from '../../models/toolbar-action.enum';

import { ColorsUtils } from '../../utils/colors-utils';

@Component({
    selector: 'exg-draw-map',
    templateUrl: './exg-draw-map.component.html',
    styleUrls: ['./exg-draw-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgDrawMapComponent implements OnChanges, OnDestroy {
    @Input() polygons: Polygon[];
    @Input() defaultCenter: Point = null;
    @Input() fitMapBoundsAlways: boolean;
    @Input() scrollWheelZoom: boolean = null;
    @Input() boundPaddingOptions: BoundPaddingOptions = null;

    @Output() readonly areaEditStarted = new EventEmitter<number>();
    @Output() readonly areaCreateStarted = new EventEmitter();
    @Output() readonly drawError = new EventEmitter<DrawError[]>();
    @Output() readonly backClick = new EventEmitter();
    @Output() readonly drawDataChanged = new EventEmitter<any>();
    @Output() readonly isMapEdited = new EventEmitter<{ edited: boolean }>();

    public drawLayers: any;
    public drawControl: any;
    public isBrowser = this.platformService.isBrowserPlatform();
    public tooltipActionEnum = ToolbarAction;

    public drawState$ = this.drawMapSelectors.drawState$;
    public mapReady$ = this.drawMapSelectors.mapReady$;
    public drawAction$ = this.drawMapSelectors.drawAction$;

    public editedFeature$ = this.drawMapEditSelectors.editedFeature$;
    public changesSource$ = this.drawMapEditSelectors.changesSource$;
    public undoEnabled$ = this.drawMapEditSelectors.undoEnabled$;
    public redoEnabled$ = this.drawMapEditSelectors.redoEnabled$;
    public isFeatureChanged$ = this.drawMapEditSelectors.isFeatureChanged$;

    public editedLayer = null;
    public editedLayerId = null;

    public featureType = FeatureType.Polygon; /// May vary for other figures

    private map: any;
    private mapAlreadyFit: boolean;

    private unsubscribe$ = new Subject<boolean>();

    constructor(private leafletService: LeafletService,
                private drawFeatureService: DrawFeatureService,
                private drawMapEditDispatchers: DrawMapEditDispatchers,
                private drawMapEditSelectors: DrawMapEditSelectors,
                private drawMapDispatchers: DrawMapDispatchers,
                private drawMapSelectors: DrawMapSelectors,
                private platformService: PlatformService,
                private cd: ChangeDetectorRef) {

        combineLatest([this.editedFeature$, this.changesSource$])
            .pipe(takeUntil(this.unsubscribe$), filter(x => !!x[0] && x[1] !== EditSource.Map)).subscribe((changes) => {
                this.editedLayer.editing.disable();
                this.editedLayer.setLatLngs(changes[0]);

                const polygon: Polygon = { points: changes[0].map(point => ({ lat: point[0], lng: point[1] })) };
                const feature = this.drawFeatureService.createFeature(this.featureType, polygon);
                this.editedLayer.editing = feature.editing;

                this.editedLayer.editing.initialize(this.editedLayer);
                this.editedLayer.editing.enable();
                this.cd.detectChanges();

                if (changes[1] === EditSource.UserCancel) {
                    this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditComplete });
                }
            });

        combineLatest([this.mapReady$, this.drawAction$, this.drawState$])
            .pipe(takeUntil(this.unsubscribe$),
                filter(x => !!x[0] && !!x[1]),
                map(x => ({ action: x[1], state: x[2] })),
                distinctUntilChanged((prev, curr) => prev.action === curr.action)
            ).subscribe((draw) => {
                switch (draw.action.type) {
                    case DrawActionType.CreateStart:
                        if (draw.state !== ToolbarAction.Add) {
                            this.startDrawFeature();
                            this.drawMapDispatchers.dispatchDrawMapTooltipAction(ToolbarAction.Add);
                            this.areaCreateStarted.emit();
                        }

                        break;
                    case DrawActionType.CreateComplete:
                        this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditStart, data: draw.action.data });
                        break;
                    case DrawActionType.EditUndo:
                        this.drawMapEditDispatchers.dispatchDrawMapEditBackAction();
                        break;
                    case DrawActionType.EditRedo:
                        this.drawMapEditDispatchers.dispatchDrawMapEditPreviourseAction();
                        break;
                    case DrawActionType.EditStart:
                        const layers = this.drawLayers.getLayers();
                        if (draw.action.data.featureIndex > layers.length - 1) {
                            return;
                        }

                        this.onLayerClick(layers[draw.action.data.featureIndex]);
                        break;
                    case DrawActionType.EditComplete:
                        if (!!this.editedLayer) {
                            this.editedLayer.editing.disable();
                            this.editedLayer = null;
                            this.editedLayerId = null;
                        }

                        this.drawMapDispatchers.dispatchDrawMapTooltipAction(null);
                        break;
                    case DrawActionType.EditCancel:
                        this.drawMapEditDispatchers.dispatchDrawMapEditCleanAction();
                        this.drawMapDispatchers.dispatchDrawMapTooltipAction(null);
                        break;
                    default:
                        break;
                }
            });

        this.isFeatureChanged$.pipe(takeUntil(this.unsubscribe$)).subscribe((isFeatureChanged) => {
            this.isMapEdited.emit({ edited: isFeatureChanged });
        });
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next(true);
        this.unsubscribe$.complete();
        this.drawMapDispatchers.dispatchDrawMapResetAction();
        this.drawMapEditDispatchers.dispatchDrawMapEditResetAction();
    }

    @HostListener('keydown.control.z') onCtrlZ() {
        this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditUndo });
    }

    @HostListener('keydown.control.y') onCtrlY() {
        this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditRedo });
    }

    public ngOnChanges(changes: SimpleChanges) {
        console.log(`this.isBrowser ${this.isBrowser}`);
        if (changes.polygons && this.polygons && this.isBrowser && this.map) {
            this.setMapData();
        }
    }

    // tslint:disable-next-line:no-shadowed-variable
    public onMapReady(map: any) {
        this.map = map;

        this.drawLayers = new this.leafletService.L.FeatureGroup();
        this.map.addLayer(this.drawLayers);

        this.drawControl = new this.leafletService.L.Control.Draw({
            draw: {
                polygon: {
                    allowIntersection: false, // Restricts shapes to simple polygons
                },
            },
            edit: {
                featureGroup: this.drawLayers,
                remove: false
            }
        });
        this.map.addControl(this.drawControl);

        this.map.on(this.leafletService.L.Draw.Event.CREATED, (event) => this.onDrawCreated(event));
        this.map.on(this.leafletService.L.Draw.Event.EDITVERTEX, (event) => this.onEditVertex(event));
        this.map.on(this.leafletService.L.Draw.Event.DRAWVERTEX, (event) => this.onDrawVertex(event));

        this.map.doubleClickZoom.disable();

        this.setMapData();
        this.drawMapDispatchers.dispatchDrawMapReadyAction();
    }

    public onToolbarActionChanged($event: ToolbarAction) {
        switch ($event) {
            case ToolbarAction.Add:
                this.areaCreate();
                break;
            case ToolbarAction.Undo:
                this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditUndo });
                break;
            case ToolbarAction.Redo:
                this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditRedo });
                break;
            default:
                break;
        }
    }

    /// call from parent component if needed
    public areaCreate() {
        this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.CreateStart });
    }

    /// call from parent component if needed
    public startFeatureEditing(featureIndex: number) {
        this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditStart, data: { featureIndex } });
    }

    /// call from parent component if needed
    public stopFeatureEditing() {
        this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditComplete });
    }

    /// call from parent component if needed
    public cancelFeatureEditing() {
        this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.EditCancel });
    }

    public onBackClick() {
        this.backClick.emit();
    }

    public onZoomChange(increase: boolean) {
        if (increase) {
            this.map.zoomIn(1);
        } else {
            this.map.zoomOut(1);
        }
    }

    private onDrawCreated($event) {
        const layer = $event.layer;
        layer.on('click', (event) => this.onLayerClick(event.target));

        this.drawLayers.addLayer($event.layer);
        const editedLayerIndex = (<any[]>this.drawLayers.getLayers()).findIndex(l => this.drawLayers.getLayerId(l) === this.drawLayers.getLayerId($event.layer));

        this.drawMapDispatchers.dispatchDrawMapDrawActionAction({ type: DrawActionType.CreateComplete, data: { featureIndex: editedLayerIndex } });

        const featureData = this.drawFeatureService.getEditedData(this.featureType, layer);
        this.drawDataChanged.emit(featureData);
    }

    private onEditVertex(event) {
        const featureData = this.drawFeatureService.getEditedData(this.featureType, event.poly);
        this.drawMapEditDispatchers.dispatchDrawMapEditFeatureChangedAction(featureData);
        this.validateMap(featureData);
        this.drawDataChanged.emit(featureData);
        this.cd.detectChanges();
    }

    private onDrawVertex(event) {
        const vertexes = event.layers.getLayers().map(l => l.getLatLng()).map(x => [x.lat, x.lng]);
        this.validateMap(vertexes);
        this.cd.detectChanges();
    }

    private startDrawFeature() {
        const layersCount = this.drawLayers.getLayers()?.length || 0;
        const editableFeature = this.drawFeatureService.createDrawFeature(this.featureType, this.map, { allowIntersection: false, shapeOptions: { stroke: true, color: ColorsUtils.getColor(layersCount), weight: 5, fill: true, clickable: true } });
        editableFeature.enable();
    }

    private editGeometry(layer) {
        if (!!this.editedLayer && !!this.editedLayer.edited) {
            return;
        }

        if (!!this.editedLayer) {
            this.editedLayer.editing.disable();
        }

        this.editedLayer = layer;
        this.editedLayerId = this.drawLayers.getLayerId(this.editedLayer);
        this.editedLayer.editing.enable();

        const featuerData = this.drawFeatureService.getEditedData(this.featureType, layer);
        this.drawMapEditDispatchers.dispatchDrawMapEditFeatureAction(featuerData);

        const indexOfLayer = this.drawLayers.getLayers().indexOf(layer);
        this.areaEditStarted.emit(indexOfLayer);

        this.fitMapToBounds(featuerData.map(x => ({ lat: x[0], lng: x[1] })));
    }

    private onLayerClick(layer) {
        this.editGeometry(layer);
        this.drawMapDispatchers.dispatchDrawMapTooltipAction(ToolbarAction.Point);
        this.cd.detectChanges();
    }

    private setMapData() {
        if (this.polygons && !!this.polygons[0] && this.isBrowser && this.map) {
            this.drawLayers.clearLayers();
            let nexColorIndex = 0;
            for (const polygon of this.polygons) {
                const newPolygon = this.drawFeatureService.createFeature(this.featureType, polygon, { stroke: true, color: !polygon.readonly ? ColorsUtils.getColor(nexColorIndex) : '#314454D9', weight: !polygon.readonly ? 5 : 1, fill: true });

                if (!polygon.readonly) {
                    newPolygon.on('click', (event) => this.onLayerClick(event.target));
                    nexColorIndex++;
                }

                this.drawLayers.addLayer(newPolygon);
            }

            const tracksCoordinates = this.polygons ? [].concat(...this.polygons.filter(p => !p.readonly).map(p => p.points)) : [];
            const coordinates = [...tracksCoordinates];

            if (coordinates && coordinates.length > 0) {
                this.fitMapToBounds(coordinates);
            }
        }
    }

    private validateMap(editedFeatureData) {
        const editedLayerIndex = (<any[]>this.drawLayers.getLayers()).findIndex(l => this.drawLayers.getLayerId(l) === this.editedLayerId);
        const layers = (<any>this.drawLayers.getLayers()).filter((_, index) => index !== editedLayerIndex);

        /// TODO read data by layer feature type?
        const layersData = layers.map(l => this.drawFeatureService.getEditedData(FeatureType.Polygon, l));

        const overlapsError = this.drawFeatureService.validate(this.featureType, editedFeatureData, editedLayerIndex, layersData);

        this.drawError.emit(overlapsError);
        this.cd.detectChanges();
    }

    private fitMapToBounds(coordinates) {
        if ((!this.mapAlreadyFit || this.fitMapBoundsAlways) && this.map && coordinates) {
            const bounds = this.leafletService.L.latLngBounds(coordinates);
            const options = !!this.boundPaddingOptions
                ? this.boundPaddingOptions
                : {};
            if (this.mapAlreadyFit) {
                this.map.fitBounds(bounds, { ...options, duration: 1.5, maxZoom: this.map.getZoom() });
            } else {
                this.map.flyToBounds(bounds, { ...options, paddingTopLeft: [320, 2], duration: 1.5 });
            }
            this.mapAlreadyFit = true;
        }
    }
}
