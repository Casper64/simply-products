import { RootStore } from "@/store";
import { Mongoose } from "mongoose";
import type {
    NextComponentType,
    NextPageContext,
    NextLayoutComponentType,
    NextPage
  } from 'next';
  import type { AppProps } from 'next/app';
  

declare global {
    var mongoose: { conn: any, promise: Promise };
}

declare module 'next' {
    type NextLayoutComponentType<P = {}> = NextComponentType<
        NextPageContext,
        any,
        P
    > & {
        getLayout?: (page: ReactNode) => ReactNode;
    };
}

declare module 'next/app' {
    type AppLayoutProps<P = {}> = AppProps & {
        Component: NextLayoutComponentType;
    };
}

export type GetLayout = (page: ReactNode) => ReactNode;


export type Page<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};


export type MyAppProps<P = {}> = AppProps<P> & {
  Component: Page<P>;
};