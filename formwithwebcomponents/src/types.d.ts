import { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react/jsx-runtime' {
    namespace JSX {
        interface IntrinsicElements {
            'wc-acomodation': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                data?: Acomodation | {};
                onChange?: (e: any) => void;
            };
            'wc-owner': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                data?: Acomodation | {};
                onChange?: (e: any) => void;
            };
            'wc-overview': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                data?: Acomodation | {};
                onSubmit?: (e: any) => void;
            };
        }
    }
}
