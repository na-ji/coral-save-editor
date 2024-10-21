import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'bypassSecurityTrustHtml',
  standalone: true,
})
export class BypassSecurityTrustHtmlPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer);

  transform(html: string | null | undefined) {
    if (html === null || html === undefined) return html;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
