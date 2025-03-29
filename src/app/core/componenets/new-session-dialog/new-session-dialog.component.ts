import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TriangulationSession } from '@core/models';
import { AppCommonModule } from 'src/app/app.common.module';

@Component({
  selector: 'app-new-session-dialog',
  imports: [AppCommonModule],
  templateUrl: './new-session-dialog.component.html',
  styleUrl: './new-session-dialog.component.scss'
})
export class NewSessionDialogComponent {

  name = '';
  description = '';

  constructor(
    private readonly dialogRef: MatDialogRef<NewSessionDialogComponent>
  ) {}

  onSaveClick() : void {
    if(this.name) {
      const returnValue: TriangulationSession = {name: this.name, description: this.description, locationSets: []};
      this.dialogRef.close(returnValue);
    }
  }
  
  isSaveDisabled() : boolean {
    return this.name == '';
  }

}
