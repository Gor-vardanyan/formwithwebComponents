import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'wc-acomodation': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'wc-owner': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
      'wc-overview': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
