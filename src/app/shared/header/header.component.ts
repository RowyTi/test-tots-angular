import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title!: string
  @Output() handleClick: EventEmitter<void> = new EventEmitter()


  emitClick(){
    this.handleClick.emit()
  }
}
