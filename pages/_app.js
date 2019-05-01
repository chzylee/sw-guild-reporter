import React from 'react';
import App, { Container } from 'next/app';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './app.css'

import GuildNavbar from "../src/components/GuildNavbar/GuildNavbar";
import { MDBContainer } from 'mdbreact';

// Boilerplate from Next.js docs at https://github.com/zeit/next.js/

export default class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps };
    };

    render() {
        const { Component, pageProps } = this.props;

        return (
            <Container>
                <MDBContainer fluid className="AppWrapper">
                    <GuildNavbar guildName="Kingfisher"/>
                    <Component {...pageProps} />
                    <MDBContainer className="Footer">
                        {/* Curently just filler space for extra space to scroll if needed */}
                    </MDBContainer>
                </MDBContainer>
            </Container>
        );
    }
}