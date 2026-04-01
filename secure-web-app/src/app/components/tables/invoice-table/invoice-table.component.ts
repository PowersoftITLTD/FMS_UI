import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { InputSwitchChangeEvent, InputSwitchModule, } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

// import { HtmlToPlaintextPipe } from './pipes/html-to-plaintext.pipe';




export interface TableColumn {
  header: string;
  field?: string;
  pipe?: string;
  pipeParams?: any;
  isNested?: boolean;
  nestedFields?: string[];
  isAction?: boolean;
  statusField?: boolean;
  sortKey?: string;
  isSwitch?: boolean;
  actionButton?: boolean;
  isNestedTree?: boolean;
  isColumnVisible?: boolean;
  isLink?: boolean;
  isDropdown?: boolean; // New property for dropdown columns
  dropdownOptions?: { label: string; value: any }[]; // Options for dropdown
  isHtml?: boolean;
  isDownload?: boolean;
  deleteActions?:boolean;
}

@Component({
  selector: 'app-invoice-table',
  standalone: true,
  imports: [

    CommonModule,
    FormsModule,

    DropdownModule,
    InputSwitchModule,
    MenuModule,
    SkeletonModule,
    CommonModule,
    FormsModule,

    // ✅ PrimeNG
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule,

    DropdownModule,
    InputSwitchModule,
    MenuModule,
    SkeletonModule

    // HtmlToPlaintextPipe
  ],
  providers:[DatePipe],
  templateUrl: './invoice-table.component.html',
  styleUrl: './invoice-table.component.scss'
})


export class InvoiceTableComponent {

  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() selectable: boolean = false;
  @Input() status: boolean = false;
  @Input() customClassValue: any = '';
  @Input() nestedColumns: TableColumn[] = [];

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onUpdateProgress = new EventEmitter<any>();
  @Output() onInitiate = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() onViewDetails = new EventEmitter<any>();
  @Input() loading: boolean = false;
  @Output() onSortChange = new EventEmitter<any>();
  @Input() customAction: any[] | undefined;
  @Output() onSelect = new EventEmitter<any>();
  @Output() onToggleSwitch = new EventEmitter<any>();
  @Output() onLinkClick = new EventEmitter<any>();
  @Output() onDropdownChange = new EventEmitter<{ item: any; value: any }>(); // New Output for dropdown
  @Output() checkboxClick = new EventEmitter<any>();

  @Input() isUpdateProgressVisible: boolean = true;
  @Input() authData: any;

  @Input() showActionCondition?: (task: any) => boolean;
  @Input() actionFilterCondition?: (item: any, actionLabel: string) => boolean;

  allSelected = false;
  indeterminate = false;
  selectedItem: any;

  currentSortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  actions: any = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.editItem(),
    },
    // {
    //   label: 'Delete',
    //   icon: 'pi pi-trash',
    //   command: () => this.deleteItem(),
    // },
    {
      label: 'Update Progress',
      icon: 'pi pi-spinner',
      command: () => this.updateItem(),
    },
    {
      label: 'Initiate',
      icon: 'pi pi-file-pdf',
      command: () => this.initateItem(),
    },
  ];

  constructor(private datePipe: DatePipe) {
  }

  applyPipe(value: any, pipe?: string, pipeParams?: any): any {
    if (!pipe) return value;
    if (pipe === 'date' && this.isDate(value)) {
      return this.datePipe.transform(value, pipeParams);
    }
    return value;
  }

  isDate(value: any): boolean {
    return value instanceof Date || (!isNaN(Date.parse(value)) && typeof value === 'string');
  }

  toggleSelectAll(event: any): void {

    const checked = event.target.checked;
    this.allSelected = checked;
    this.indeterminate = false;
    this.data.forEach((item) => {
      if (item?.isCancel) return;
      item.selected = checked;
    });
    this.emitSelectedItems();
  }

  updateSelection(): void {
    const selectedItems = this.data.filter((item) => item.selected);
    this.allSelected = selectedItems.length === this.data.length;
    this.indeterminate = selectedItems.length > 0 && selectedItems.length < this.data.length;
    this.emitSelectedItems();
  }

  emitSelectedItems(): void {
    const selectedItems = this.data.filter((item) => item.selected && !item?.isCancel);
    this.selectionChange.emit(selectedItems);
  }

  editItem() {
    this.onEdit.emit(this.selectedItem);
  }

  deleteItem() {
    this.onDelete.emit(this.selectedItem);
  }
  updateItem() {
    this.onUpdateProgress.emit(this.selectedItem);
  }
  initateItem() {
    this.onInitiate.emit(this.selectedItem);
  }
  viewDetails(item: any) {
    this.onViewDetails.emit(item);
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    switch (status) {
      case 'Completed':
        return 'status completed';
      case 'In Progress':
      case 'Others':
        return 'status inProcess';
      default:
        return 'status notStarted';
    }
  }

  getStatusLabel(status: string): string {
  switch (status) {
    case 'P': return 'Pending';
    case 'D': return 'Draft';
    case 'A': return 'Approved';
    default: return status || '';
  }
}

getStatusSeverity(status: string): 'success' | 'warning' | 'info' {
  switch (status) {
    case 'A': return 'success';
    case 'P': return 'warning';
    case 'D': return 'info';
    default: return 'info';
  }
}

  sortBy(field: string | undefined) {
    if (!field) return;
    if (this.currentSortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = field;
      this.sortDirection = 'asc';
    }
    this.onSortChange.emit({ SortBy: this.currentSortField, SortOrder: this.sortDirection });
  }

  clearAllCheckbox(): void {
    this.allSelected = false;
    this.indeterminate = false;
    this.data.forEach((item) => (item.selected = false));
    this.emitSelectedItems();
  }

 emitSelectedItem(item: any) {
  this.selectedItem = item;
  this.onSelect.emit(item);

  if (Array.isArray(this.customAction)) {
    const baseActions = [...this.customAction];

    const filteredActions = baseActions
      .filter((action) => {
        if (this.actionFilterCondition) {
          return this.actionFilterCondition(item, action.label);
        }
        return true; // default: include all
      })
      .map((action) => ({
        ...action,
        command: () => action.command(item),
      }));

    this.customAction = filteredActions;
  }
}

  toggleSwitch(event: InputSwitchChangeEvent, item: any) {
    this.onToggleSwitch.emit({ checked: event.checked, item });
  }

  onDropdownValueChange(selectedValue: any, item: any) {
    item.selectedOption = selectedValue; // Update the item with the selected value
    this.onDropdownChange.emit({ item, value: selectedValue });
  }
  onCheckboxClick(event: any, item: any) {
    this.checkboxClick.emit(item); // Emit the selected item
    event.stopPropagation();
  }

  handleLinkClick(item: any) {
    this.onLinkClick.emit(item);
  }
  shouldShowActionIcon(item: any): boolean {
    // If parent passed a showActionCondition function, use it
    if (this.showActionCondition) {
      return this.showActionCondition(item);
    }
    // Otherwise, show the icon if any customAction is present
    return Array.isArray(this.customAction) && this.customAction.length > 0;
  }

  
  deleteRow(item: any) {
      const index = this.data.indexOf(item);
      if (index > -1) {
        this.data.splice(index, 1);
    }
  }

}
