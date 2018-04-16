import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { URLSearchParams } from '@angular/http';

import { IApplicationVersion } from './shared/application-version';
import { environment } from '../environments/environment';

import { AgreementService } from './services/agreement.service';
import { ApplicationVersionService } from './services/application-version.service';
import { GrantTokenService } from './services/grant-token.service';
import { QueryParametersService } from './services/query-parameters.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    unauthorized = true;
    authorizing = true;
    applicationVersion: IApplicationVersion = {
        major: 0,
        minor: 0,
        patch: 0
    };
    clientAppIsProduction = false;

    constructor(
        private _agreementService: AgreementService,
        private _applicationVersionService: ApplicationVersionService,
        private _grantTokenService: GrantTokenService,
        private _queryParametersService: QueryParametersService,
        private _location: Location) { }

    ngOnInit() {
        this.clientAppIsProduction = environment.production;

        this.authorizing = true;
        const hashParts = window.location.hash.split('?');
        const reportName = hashParts[0].slice(2);
        console.log(`app started with report: ${reportName}`);
        let eat = null;
        if (hashParts.length === 2) {
          eat = new URLSearchParams(hashParts[1]).get('embeddedAppToken');
        }

        this._grantTokenService.getGrantToken(eat).subscribe(
            token => {
                this._agreementService.getRevisoAgreement().subscribe(
                    agreement => {
                        this.unauthorized = false;
                        this.authorizing = false;
                    }
                );
            },
            error => {
                this.unauthorized = true;
                this.authorizing = false;
            });
    }

}
