import { ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TokenService } from '../../../services/common/token.service';

import { ExgBaseParamsConfig } from '../../../exg-params.config';
import { UrlUtils } from '../../../utils/url-utils';

@Component({
    selector: 'exg-image',
    templateUrl: './exg-image.component.html',
    styleUrls: ['./exg-image.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExgImageComponent implements OnChanges {
    @Input() image: string;
    @Input() alternativeImages: string[];
    @Input() showSpinner = true;
    @Input() spinnerHeight: string;
    @Input() spinnerWidth: string;
    @Input() authorized: boolean;
    @Input() alt: string;
    @Input() @HostBinding('class.round') isRound: boolean;

    @HostBinding('style.background-image') resultingImage: string;

    public imageUrl: string;
    public isLoading: boolean;

    constructor(private tokenService: TokenService) {}

    public ngOnChanges(_: SimpleChanges) {
        this.alternativeImages = (this.alternativeImages || []).filter(i => i).filter((val, ind, arr) => arr.indexOf(val) === ind);
            //@ts-ignore
        this.imageUrl = !this.image
            ? this.alternativeImages && this.alternativeImages[0] ? this.alternativeImages[0] : null
            : this.image;

        this.isLoading = true;
    }

    public onLoadComplete() {
        const imageUrl = this.authorized ? UrlUtils.appendQueryParams(this.imageUrl, ExgBaseParamsConfig.auth.accessTokenParamName, this.tokenService.getAuthToken()) : this.imageUrl;
        this.resultingImage = `url(${imageUrl})`;
        this.isLoading = false;
    }

    public onLoadError() {
        if (this.imageUrl === this.image) {
            this.imageUrl = this.alternativeImages[0];
        } else {
            this.setImageUrl(0);
        }
    }

    private setImageUrl(index: number) {
        if (index >= this.alternativeImages.length) return;
        if (this.imageUrl === this.alternativeImages[index]) {
            this.imageUrl = this.alternativeImages[index + 1];
        } else {
            this.setImageUrl(index + 1);
        }
    }
}
