import { Injectable } from '@angular/core';
import Quill from 'quill';
import QuillMathEditor from './../quill-module/quillMathEditor';
import Formula from './../quill-module/formula';
import { QuillImageUpload } from './../quill-module/quillImageUpload';

@Injectable()
export class QuillInitializeService {
    constructor() {
        Quill.register('modules/mathEditor', QuillMathEditor, true);
        Quill.register('modules/formula', Formula, true);
        Quill.register('modules/imageUpload', QuillImageUpload, true);

    }
}
