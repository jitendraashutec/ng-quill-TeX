import { Component, AfterViewInit, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {


  title = 'demo-app';
  editorContent = [];
  show = false;
  quillImageUrl = '';
  answerIndex: number;
  imageArray = ['https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/question/getQuestionImage/1584424319539?d=1584424319960', 
  'https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/question/getQuestionImage/1559802082816?d=1584424319961']
  imageIndex = 0;
  public oWebViewInterface = (window as any).nsWebViewInterface;

  

  // Math quill options
  mathOptions = {
    quill_options: {
      maths: [{
        cmd: 'sqrt', // Math quill 
        name: 'Square Root',
        url: '' // Image url of maths function
      },
      {
        cmd: 'pm',
        name: 'Plus Minus',
        url: '' // Image url of maths function
      },
      ]
    }
  }

  // quil config options
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        ['code-block', 'image'],
        ['mathEditor']
      ],
      handlers: {
        // handlers object will be merged with default handlers object
        'mathEditor': () => {
        }
      },
    },
    mathEditor: { mathOptions: this.mathOptions },
    blotFormatter: {},
    // deleteBlotFormatter: {},
    syntax: true
  };

  constructor(private cd: ChangeDetectorRef, private ngZone: NgZone) {
  }

  // Text change in quill editor
  onTextChanged(delta, oldDelta, sourc) {
    // this.ngZone.run(() => {
    //   text.answerIndex = this.answerIndex;
    //   this.oWebViewInterface.emit('quillContent', text);
    //   this.cd.detectChanges();
    // });

  }

  ngOnInit(): void {

    if (this.oWebViewInterface) {
      this.oWebViewInterface.on('answerIndex', (answerIndex) => {
        this.ngZone.run(() => {
          this.answerIndex = answerIndex;
          this.cd.detectChanges();
        });
      });

      this.oWebViewInterface.on('imageUrl', (url) => {
        this.ngZone.run(() => {
          this.quillImageUrl = url;
        });
      });

      this.oWebViewInterface.on('deltaObject', (deltaObject) => {
        this.ngZone.run(() => {
          this.show = false;
          this.editorContent = deltaObject;
          this.cd.detectChanges();
          this.show = true;
        });
      });
    }
    this.show = true;
  }

  // Image Upload
  fileUploaded(quillImageUpload: any) {
    if (quillImageUpload.isMobile) {
      // this.oWebViewInterface.emit('uploadImageStart', true);
    }

    this.ngZone.run(() => {
      const url = 'https://storage.googleapis.com/stateless-campfire-pictures/2019/05/e4629f8e-defaultuserimage-15579880664l8pc.jpg';
      this.imageIndex = (this.imageIndex) ? 0 : 1;
      this.quillImageUrl = this.imageArray[this.imageIndex];
    });


  }

  ngAfterViewInit(): void {
    // throw new Error("Method not implemented.");
  }


  imageUpload() {
    this.oWebViewInterface.emit('uploadImageStart', true);
  }

  editorLoadFinished(event) {
  }




}
