import * as moment from 'moment';
import { FormGroup } from '@angular/forms';
import { MatDialog } from "@angular/material";
import { ErrorDialogComponent } from "../components/common/error-dialog/error-dialog.component";
import { InfoDialogComponent } from '../components/common/info-dialog/info-dialog.component';

export class AppGui {
    public static showError(dialog: MatDialog, title: string, msg: string, detail: string) {
        dialog.open(ErrorDialogComponent, {
            data: {
                title: title,
                msg: msg,
                detail: detail
            },
            width: '300px',
            height: '250px',
            panelClass: 'appErrorPanel'
        });
    }

    public static showInfo(dialog: MatDialog, title, msg: string, detail: string) {
        dialog.open(InfoDialogComponent, {
            data: {
                title: title,
                msg: msg,
                detail: detail
            },
            width: '300px',
            height: '200px',
            panelClass: 'appInfoPanel'
        });
    }
}
