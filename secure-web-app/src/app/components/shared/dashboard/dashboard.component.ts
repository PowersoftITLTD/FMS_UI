import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CommonModule } from '@angular/common';

import { ToasterContainerComponent } from '../toaster-container/toaster-container.component';
import { AuthService } from '../../../services/auth/auth.service';

import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SplitterModule } from 'primeng/splitter';
import { HeaderBarComponent } from '../layout/header-bar/header-bar.component';
import { Router } from '@angular/router';
import { ToasterService } from '../../../services/toaster/toaster.service';
import { ApiService } from '../../../services/api.service';
import { ConfigService } from '../../../services/config.service';
import * as CryptoJS from 'crypto-js';
import { tap, catchError, of } from 'rxjs';
import { InvoiceUploadComponent } from '../../../pages/invoice-upload/invoice-upload.component';





interface list_of_docs {
  mkey: number;
  sR_NO: number;
  doC_NAME: string;
  doC_TYPE: string;
  filE_NAME: string;
  filecontents: string | null;
  filecontentvar: string;
  uploadeD_BY: number;
  uploaD_DATE: string;  // You might want to change this to `Date` if using Date objects
  iS_MANDATORY: string;
  statuS_FLAG: string;
  approveR_ID: number;
  approvE_ACTION_DATE: string;  // Same as above, consider `Date` if necessary
  attributE1: string;
  attributE2: string;
  attributE3: string;
  attributE4: string;
  attributE5: string;
  createD_BY: number;
  creatioN_DATE: string;  // Same as above, consider `Date`
  lasT_UPDATED_BY: number;
  lasT_UPDATE_DATE: string;  // Same as above, consider `Date`
  deletE_FLAG: string;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ListboxModule,
    TableModule,
    BadgeModule,
    OverlayPanelModule,
    CommonModule,
    ChartModule,
    CardModule,
    ButtonModule,
    SplitterModule,
    // HeaderBarComponent,
    ToasterContainerComponent,
    InvoiceUploadComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
   schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})


export class DashboardComponent implements OnInit {

  
  panelSizes = [ 100, 100];

  displayFiles:list_of_docs|any = [];
  encrypted_model:any = [];
   isLoading: boolean = false;  // Tracks loading state
  isSuccess: boolean = false;  // Tracks success state

  selectedFiles: any[] = []; //selected files
  selectedFileNames: string[] = []; // Name of selected files
  fileEvents:any[]=[]
  constructor(private authService:AuthService,             
       private apiService: ApiService,   
      private router: Router, 
      private toaster: ToasterService){}
   // Sample data for sales pie chart

  private config = inject(ConfigService);
  ngOnInit() {
    console.log('Welcome to dashboard...');
    setTimeout(() => {
      this.panelSizes = [ 100, 100];
    }, 0);
  
  }

  selectedFileName: string | null | any;
  encryptedFileName: string | null = null;
  fileType: string | null | any;
  encryptedFile: any;
  file:File | any;
  multi_file:any=[];


onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    console.log('dedicated file',event)

    if (input.files && input.files.length > 0) {
        const newFiles = Array.from(input.files);

        newFiles.forEach((newFile) => {
            const alreadyExists = this.selectedFiles.some(
                (file) => file.name === newFile.name && file.lastModified === newFile.lastModified,
            );

            if (!alreadyExists) {
                this.selectedFiles.push(newFile);
                this.selectedFileNames.push(newFile.name);
            }
        });

        // this.uploadFiles();
    }
}

// async uploadFiles() {
//   const encryptedFiles: any[] = [];  // Array to hold multiple request bodies for encrypted files
//   const displayFiles:any[]=[]

//   // Loop through each file in selectedFiles and encrypt them one by one
//   for (const file of this.selectedFiles) {
//     try {
//       // Encrypt the file
//       console.log('USL: ', file);
//       const check = 
//       console.log()
//       const encryptedFile: string = await this.authService.fileEncryption(file);  // Pass the file directly here

      
      
//       // Prepare the request body for this file
//       const body: list_of_docs = {
//         mkey: 4,
//         sR_NO: 0,
//         doC_NAME: file.name,
//         doC_TYPE: file.type,
//         filE_NAME: file.name,
//         filecontents:null, //"filecontents",  // This can be adjusted or removed if unnecessary
//         filecontentvar: encryptedFile,
//         uploadeD_BY: 2693,
//         uploaD_DATE: new Date().toISOString(),
//         iS_MANDATORY: "Y",
//         statuS_FLAG: "P",
//         approveR_ID: 0,
//         approvE_ACTION_DATE: new Date().toISOString(),
//         attributE1: "",
//         attributE2: "",
//         attributE3: "",
//         attributE4: "",
//         attributE5: file.type,
//         createD_BY: 2693,
//         creatioN_DATE: new Date().toISOString(),
//         lasT_UPDATED_BY: 2693,
//         lasT_UPDATE_DATE: new Date().toISOString(),
//         deletE_FLAG: "N"
//       };



//       // const encrypt_body = this.authService.encryptObject(body)

//       // console.log('encrypt_body: ', encrypt_body)

//       // Add the encrypted file request body to the array
//       displayFiles.push(body);

      
//       // encryptedFiles.push(encrypt_body);

//       console.log('disp files: ', displayFiles);

//        const encryptedFileValues = await this.extractEncryptedFileValues(encryptedFiles);

//   // Log the encrypted values
//       // console.log('encrypt_body: ', encrypt_body);


//       const encrypt_model = this.authService.encryptAES_JSON( displayFiles);
//       const dcrypt_model = this.authService.decryptAES(encrypt_model);

//       console.log('encrypt_model: ', encrypt_model)
//       console.log('dcrypt_model_spp: ', dcrypt_model)
//       console.log('encryptedFileValues: ', encryptedFileValues)

//       const butes_in_arr = encryptedFileValues.filter((value:any)=> typeof value === 'string')

//       console.log('butes_in_arr: ', butes_in_arr)

//       this.displayFiles = displayFiles;
//       this.encrypted_model = encrypt_model

//     } catch (error) {
//       console.error('Encryption failed for file:', file, error);
//     }
//   }


// }


onFileSelected(event: any) {
  const encryptedFiles: any[] = [];  // Array to hold multiple request bodies for encrypted files
  const displayFiles:any[]=[]
  const upload_files:any= []
  console.log('event.target.files: ', event.target.files)
  const files: FileList = event.target.files;

  if (!files || files.length === 0) return;

  Array.from(files).forEach((file) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);

      // ✅ SAME AS Convert.ToBase64String(byte[])
      const base64String = this.bytesToBase64(bytes);

      console.log('Base64 String:', base64String);

      // Send to API for each file
      const payload = {
        // fileName: file.name,
        // fileData: base64String

        mkey: 5,
        sR_NO: 0,
        doC_NAME: file.name,
        doC_TYPE: file.type,
        filE_NAME: file.name,
        filecontents:null, //"filecontents",  // This can be adjusted or removed if unnecessary
        filecontentvar: base64String,
        uploadeD_BY: 2693,
        uploaD_DATE: new Date().toISOString(),
        iS_MANDATORY: "Y",
        statuS_FLAG: "P",
        approveR_ID: 0,
        approvE_ACTION_DATE: new Date().toISOString(),
        attributE1: "",
        attributE2: "",
        attributE3: "",
        attributE4: "",
        attributE5: file.type,
        createD_BY: 2693,
        creatioN_DATE: new Date().toISOString(),
        lasT_UPDATED_BY: 2693,
        lasT_UPDATE_DATE: new Date().toISOString(),
        deletE_FLAG: "N"
      };

      upload_files.push(payload)

      console.log('arr: ', upload_files )

             const encryptedFileValues = await this.extractEncryptedFileValues(encryptedFiles);

      
      const butes_in_arr = encryptedFileValues.filter((value:any)=> typeof value === 'string')

      console.log('displayFiles: ', upload_files)

      this.displayFiles = upload_files;

      console.log('displayFiles: ', this.displayFiles);

    const encrypt_model = this.authService.encryptAES_JSON(upload_files);
          this.encrypted_model = encrypt_model

    console.log('encrypt_model: ', encrypt_model)
  //  this.decryptAndDownload(base64String, file.name)
    

    console.log(encrypt_model)


      // Example of API call for each file
      // this.apiService.uploadFile(payload).subscribe(response => {
      //   console.log('Upload successful', response);
      // });
    };

    reader.readAsArrayBuffer(file);
  });
}

base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000; // prevents call stack overflow

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}


// Decrypt Base64 and Trigger File Download
decryptAndDownload(base64String: string, fileName: string) {
  // Convert base64 back to byte array
  const bytes = this.base64ToBytes_(base64String);

  // Create a Blob object with the byte array and specify the file type (MIME type)
  const blob = new Blob([bytes], { type: this.getFileMimeType(fileName) });

  // Create a temporary link element for downloading the file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  // Trigger the download by simulating a click event
  link.click();

  // Clean up the URL object
  URL.revokeObjectURL(link.href);
}

// Base64 to Bytes Conversion (Already provided earlier)
base64ToBytes_(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

// Get the MIME Type based on the file extension
getFileMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();

  console.log('EXT: ', ext)
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'pdf':
      return 'application/pdf';
    case 'txt':
      return 'text/plain';
    case 'html':
      return 'text/html';
    case 'csv':
      return 'text/csv';
    default:
      return 'application/octet-stream'; // fallback type
  }
}

 // Triggered on button click
  handleSaveClick(): void {
    this.isLoading = true; // Start loading
    this.isSuccess = false; // Reset success state

    console.log('encrypted_model: ', this.encrypted_model);
    const dcrypt_model = this.authService.decryptAES(this.encrypted_model);

    console.log('dcrypt_model: ', dcrypt_model)

    // Call your API method to upload files
    this.saveFiles(this.encrypted_model)
      .pipe(
        tap((res) => {
          console.log("Files uploaded successfully:", res);
          // On success, update the state to show the checkmark
          this.isSuccess = true;
          
        }),
        catchError((error) => {
          console.error('API Error:', error);
          // Handle error and reset loading state
          this.isLoading = false;
          return of(null); // Return a default value to continue the observable chain
        })
      )
      .subscribe(() => {
        // Reset the button after 1 second if successful
        setTimeout(() => {
          this.isLoading = false;
          this.isSuccess = false;
        }, 1000);
      });
  }

  // Upload files via API call (pass encrypted files here)
  saveFiles(encryptedFiles: any) {
    // Modify this to fit the actual payload and API endpoint

    const encrypted_body = {
      encryptjosn:encryptedFiles
    }

    return this.apiService.postSecureAPI('Upload-File_NT', encrypted_body, false, true).pipe(
      catchError((error) => {
        console.error('Error during file upload:', error);
        return of(null); // Gracefully handle the error
      })
    );
    
  }
uploadFilesCheck(){
  console.log('this.displayFiles ',this.displayFiles);
}

async extractEncryptedFileValues(encryptedFiles: any[]){
  // Wait for all promises to resolve
  // const resolvedFiles = await Promise.all(encryptedFiles);

  // Extract the __zone_symbol__value from each resolved promise
  const encryptedValues = encryptedFiles.map((resolvedFile: any) => resolvedFile.__zone_symbol__value);

  return encryptedValues;
}


downloadFile(file:any){
  // console.log('Check the encrypted file filecontentvar: ', file)

   if (!file) {
      console.error('Encrypted file content is missing');
      this.toaster.show('error', 'Error', 'Encrypted file content is missing');
      return;      
    }

    //  this.decryptAndDownload(file.filecontentvar, file.filE_NAME);

     const body = {
      mkey:4,//file.mkey,
      srNo:59 //file.sR_NO
     }


     console.log('File details: ', file)


    

  const downloadFile_encrypted = this.authService.encryptAES_JSON(body);

  const file_d =      {
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
      a.download = `${file.doC_TYPE}`;
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

fileDecryption(encryptedBase64: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!encryptedBase64) {
      reject("No encrypted data provided");
      return;
    }

    // Convert key properly
    const keyBytes = this.getKeyBytes_file(this.config.encryptionKey, 32);
    const key = CryptoJS.enc.Utf8.parse(keyBytes);

    // Create IV (must be 16 bytes for AES)
    const iv = CryptoJS.lib.WordArray.create(new Uint8Array(16)); // Zero IV, same as during encryption

    // Decrypt the Base64-encoded ciphertext
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedBase64);

    // Wrap the encrypted data in a CipherParams object
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: encryptedData,
      iv: iv
    });

    // Decrypt the data using the CipherParams object
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Log decrypted data to check the result
    console.log("Decrypted WordArray:", decrypted);

    // Check if decrypted data is valid
    if (!decrypted || decrypted.sigBytes < 0) {
      reject("Decryption failed: invalid decrypted data");
      return;
    }

    // Convert decrypted WordArray to ArrayBuffer
    const decryptedArrayBuffer = new ArrayBuffer(decrypted.sigBytes);
    const decryptedBytes = decrypted.words;

    const byteArray = new Uint8Array(decryptedArrayBuffer);
    for (let i = 0; i < decrypted.sigBytes; i++) {
      byteArray[i] = (decryptedBytes[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }

    // Create a Blob from the decrypted ArrayBuffer
    const blob = new Blob([decryptedArrayBuffer], { type: this.fileType });

    // Resolve with the decrypted Blob (which can be used to download the file)
    resolve(blob);
  });
}







  getKeyBytes_file(key: string, length: number): string {
    // Pad or truncate key to desired length
    if (key.length < length) {
      return key.padEnd(length, '0'); // Pad with zeros
    } else if (key.length > length) {
      return key.substring(0, length); // Truncate
    }
    return key;
  }


  decryptFile_dash(encryptedFile?: any, file_type?:any, file_name?:any) {
    console.log('file_name: ', file_name, 'fileType: ', file_type, 'encryptionKey: ',this.config.encryptionKey) ;

    if (!encryptedFile) {
      console.error('No file to decrypt');
      this.toaster.show('error', 'No file found', 'Please upload file for decrypt')

      return;
    }

    const iv = CryptoJS.lib.WordArray.create(new Array(16).fill(0));


    // Decrypt the file
    const decrypted = CryptoJS.AES.decrypt(encryptedFile, this.config.encryptionKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convert WordArray back to ArrayBuffer
    const wordArray = decrypted as CryptoJS.lib.WordArray;
    const uint8Array = new Uint8Array(wordArray.sigBytes);

    for (let i = 0; i < wordArray.sigBytes; i++) {
      const byte = (wordArray.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      uint8Array[i] = byte;
    }

    console.log('Decrypted bytes:', uint8Array);

    // Optional: convert back to Blob or download
    const blob = new Blob([uint8Array], { type: file_type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.selectedFileName;
    a.click();
    URL.revokeObjectURL(url);

    this.toaster.show('success', 'File download successfully', 'File get decrypted')
  }



  decryptFile() {
    // this.authService.decryptFile();  
  }

removeFile(index:any){
    this.selectedFileNames.splice(index, 1);

}




  
}
