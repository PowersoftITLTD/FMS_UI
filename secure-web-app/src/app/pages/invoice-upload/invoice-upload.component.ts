import { CommonModule, isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';


import {
  Search, Eye, Upload, ChevronLeft, ChevronRight,
  Filter, Clock, FileText
} from 'lucide-angular';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import { clone } from 'lodash';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { storedDetails } from '../../store/auth/auth.selectors';
import { AuthState } from '../../store/auth/auth.state';
import { InvoiceTableComponent, TableColumn } from '../../components/tables/invoice-table/invoice-table.component';

type InvoiceStatus = 'pending' | 'uploaded' | 'sanction';

type SeverityType = 'success' | 'warning' | 'info' | 'danger' | 'secondary' | 'contrast' | undefined;


interface Invoice {
  id: number;
  invoiceNo: number;
  date: string;
  customer: string;
  warehouse: string;
  status: InvoiceStatus;
  category: string;
  notes: string;
  hasUpload: boolean;
  enteredBy: string;
}


@Component({
  selector: 'app-invoice-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    BadgeModule,
    TagModule,
    CardModule,
    CalendarModule,
    SelectButtonModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    TitleCasePipe,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    ToggleButtonModule,
    InvoiceTableComponent
  ],
  templateUrl: './invoice-upload.component.html',
  styleUrl: './invoice-upload.component.scss'
})
export class InvoiceUploadComponent implements OnInit {

 



  searchQuery: string = '';
  entriesPerPage: number = 10;
  fromDate: Date | undefined;
  toDate: Date | undefined;

  warehouseDetails:any = [];

  invoiceDetails: any

  showProjectDialog: boolean = false;

  // Dropdown options
  // Dropdown options


 columns: TableColumn[] = [
  { header: 'Invoice No', field: 'INVOICE_NO' },
  { header: 'Date', field: 'INVOICE_DATE', pipe: 'date', pipeParams: 'dd/MM/yyyy' },
  { header: 'Customer', field: 'CUSTOMER_NAME' },
  { header: 'Warehouse', field: 'WAREHOUSE_CODE' },
  { header: 'Status', field: 'STATUS_FLAG', statusField: true },
  { header: 'Category', field: 'CAREGORY' },
  { header: 'Notes' },
  { header: 'Action', isAction: true },
  { header: 'Entered By', field: 'CREATED_BY' }
];


  warehouseOptions = [
    { label: 'All', value: 'all' },
    { label: 'Mumbai', value: 'mumbai' },
    { label: 'Delhi', value: 'delhi' },
    { label: 'Pune', value: 'pune' },
    { label: 'Chennai', value: 'chennai' }
  ];

  executiveOptions = [
    { label: 'Krishna Rawlo', value: 'krishna' },
    { label: 'User X', value: 'user-x' },
    { label: 'User Y', value: 'user-y' }
  ];

  selectedWarehouse = { label: 'All', value: 'all' };
  selectedExecutive = { label: 'Krishna Rawlo', value: 'krishna' };

  entriesOptions = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 }
  ];

  // Mock data
  mockData: Invoice[] = [
    { id: 1, invoiceNo: 56, date: '22-Aug-17', customer: 'Dummy A', warehouse: 'Mumbai', status: 'pending', category: 'Distributor', notes: '', hasUpload: true, enteredBy: '--' },
    { id: 2, invoiceNo: 57, date: '23-Aug-17', customer: 'Dummy A', warehouse: 'Mumbai', status: 'pending', category: 'Distributor', notes: '', hasUpload: false, enteredBy: '--' },
    { id: 3, invoiceNo: 58, date: '21-Aug-17', customer: 'Dummy B', warehouse: 'Pune', status: 'uploaded', category: 'Retail', notes: '', hasUpload: false, enteredBy: 'User X' },
    { id: 4, invoiceNo: 59, date: '22-Aug-17', customer: 'Dummy B', warehouse: 'Delhi', status: 'sanction', category: 'Retail', notes: '', hasUpload: false, enteredBy: 'User Y' },
    { id: 5, invoiceNo: 60, date: '24-Aug-17', customer: 'Dummy C', warehouse: 'Chennai', status: 'uploaded', category: 'Wholesale', notes: '', hasUpload: false, enteredBy: 'User Z' },
  ];

  // Status styles mapping
  statusStyles: any = {
    pending: 'bg-warning/20 text-warning border-warning/30',
    uploaded: 'bg-success/20 text-success border-success/30',
    sanction: 'bg-primary/20 text-primary border-primary/30'
  };

  constructor(private authService: AuthService,
    private apiService: ApiService,
    private toaster: ToasterService,
    private renderer: Renderer2,
    private store:Store,
    private auth:AuthService,
    // @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnInit(): void {
    // Initialization logic if needed
      this.store.select(storedDetails).pipe(take(1)).subscribe((user: AuthState) => {
          const decryptUser: string = user.user
    
          const encryptedUser = this.auth.decryptAES(decryptUser);   
          console.log('encryptedUser: ', encryptedUser);
          this.getUploadList();             
        })
  }




  getStatusSeverity(status: InvoiceStatus): SeverityType {
    switch (status) {
      case 'pending': return 'warning';
      case 'uploaded': return 'success';
      case 'sanction': return 'info';
      default: return 'secondary';
    }
  }



  getUploadList() {
    this.apiService.getSecureAPI('GetUploads_NT', false, true).subscribe({
      next:(res)=>{

        const encrypted_warehouse_list = clone(res.data)

        const dcrypted_warehouse = this.authService.decryptAES(encrypted_warehouse_list);             

        const decrypted_warehouse_parsed = (JSON.parse(dcrypted_warehouse));

        console.log('decrypted_warehouse_parsed: ', decrypted_warehouse_parsed)

        this.warehouseDetails = decrypted_warehouse_parsed; 


      }
    })
  }



  viewResults(): void {
    // Implement view results logic
    console.log('View results clicked');
  }

  onUpload(invoice: Invoice): void {
    // Implement upload logic
    console.log('Upload invoice:', invoice);
  }

  onView(invoice: Invoice): void {
    // Implement view logic
    console.log('View invoice:', invoice);
    this.invoiceDetails = invoice;
    this.showProjectDialog = true;
  }

  openProjectDialog(invoice: any) {
  }

  previousPage(): void {
    // Implement pagination logic
  }

  nextPage(): void {
    // Implement pagination logic
  }


  downloadFile(file: any) {
    console.log('Check the encrypted file filecontentvar: ', file)

    if (!file) {
      console.error('Encrypted file content is missing');
      this.toaster.show('error', 'Error', 'Encrypted file content is missing');
      return;
    }

    //  this.decryptAndDownload(file.filecontentvar, file.filE_NAME);

    const body = {
      mkey: 4,
      srNo: file.invoiceNo //file.sR_NO
    }


    const downloadFile_encrypted = this.authService.encryptAES_JSON(body);

    const file_d = {
      encryptjosn: downloadFile_encrypted
    }

    this.apiService
      .postSecureDownloadAPI('Download', file_d, false, true)
      .subscribe({
        next: (blob: Blob) => {
          console.log('Download response:', blob);

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'file.docx';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err: any) => {
          console.error('Download failed', err);
          this.toaster.show('error', 'Error', 'File download failed');
        }
      });



    // Proceed with the decryption or download logic here
    console.log('Decrypted file content:', file.filecontentvar)

    // console.log('FILE: ', file.target);
  }


  closeProjectDialog() {
    this.showProjectDialog = false;
  }



}
