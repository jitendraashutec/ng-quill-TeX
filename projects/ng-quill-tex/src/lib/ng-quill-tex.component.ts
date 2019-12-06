import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import Quill from 'quill';
import { debounceTime } from 'rxjs/operators';
import { QuillInitializeService } from './services/quillInitialize.service';
import BlotFormatter from 'quill-blot-formatter';
import { FormGroup, FormControl } from '@angular/forms';
import { QuillImageUpload } from './models/quill-image-upload';

@Component({
  selector: 'ng-quill-tex',
  templateUrl: './ng-quill-tex.component.html',
  styles: []
})
export class NgQuillTexComponent implements OnInit, QuillImageUpload {

  @Input() modules;
  @Input() _imageUrl;
  @Output() textChanged = new EventEmitter<any>();
  @Output() fileUploaded = new EventEmitter<QuillImageUpload>();
  @Input() group?: FormGroup;
  @Input() controlName?: FormControl;
  @Input() content?: any;
  @Input() editorContent: any;
  @Input() isMobile: boolean;
  @Input() customToolbarPosition = 'top';
  @Input() styles: any;
  @Output() editorLoadFinished = new EventEmitter<boolean>();

  quillEditorRef;

  @ViewChild('quillEditior') quillEditior: QuillEditorComponent;
  constructor(private quillInitializeService: QuillInitializeService,
    private cd: ChangeDetectorRef) {
    this.modules = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike', 'code', 'image'],
          [{ 'color': [] }],
        ]
      },
    };
    Quill.register('modules/blotFormatter', BlotFormatter);
  }

  ngOnInit() {
    // Register handler
    this.modules.imageUpload = {
      // web upload image handler
      customUploader: (file) => {
        this.onfileUploaded(false, file);
      },
      // mobile upload image handler
      mobileUploader: () => {
        this.onfileUploaded(true);

      },
      isMobile: this.isMobile
    };

    // When editor's content change emit it's html and delta content.
    setTimeout(() => {
      this.quillEditior
        .onContentChanged
        .pipe(
          debounceTime(400),
        )
        .subscribe((data) => {
          this.onTextChanged({ 'html': data.html, 'delta': data.content.ops });
        });
    }, 0);
  }

  // Get Editor instatnce when editor is created
  getEditorInstance(editorInstance: any) {
    this.editorLoadFinished.emit(true);
    this.quillEditorRef = editorInstance;
    if (this.content) {
      setTimeout(() => {
        this.editorContent = this.content;
        this.cd.markForCheck();
      }, 10);
    }
  }

  onTextChanged(html: any) {
    this.textChanged.emit(html);
  }

  // Emit the file and and  callback function to set image in editor
  // If Image is uploading in web so we have image object so it is optional
  // Ismobile:  pass parameter because for mobile we selecting image from mobile.
  // setImage: callback function to set image
  onfileUploaded(isMobile: boolean, file?: File): void {
    const quillImageUpload: QuillImageUpload = { file: file, setImage: this.setImage, isMobile: isMobile };
    quillImageUpload.file = file;
    this.fileUploaded.emit(quillImageUpload);
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  @Input()
  set imageUrl(fileName: string) {
    if (fileName) {
      this.displayImage(this.quillEditorRef, fileName);
    }
    this._imageUrl = fileName;
  }


  setImage = (imageUrl: string) => {
    this.displayImage(this.quillEditorRef, imageUrl);
  }

  // Set the image in quill editor
  displayImage(quillEditorRef, imageUrl) {
    const range = quillEditorRef.getSelection();
    const imageIndex = range.index;
    quillEditorRef.insertEmbed(imageIndex, 'image', imageUrl);
  }

}
