import { Directive } from "@angular/core";

@Directive({
    selector: '[app-input]',
    standalone: true,
    host: {
        class:
      'block w-full h-9 p-2 bg-white border border-gray-200 rounded-md text-sm outline-none placeholder:text-slate-400 placeholder:text-sm focus:border-primary-focus !ring-offset-0 !ring-0 transition duration-500',
    }
})

export class InputDirective{}