import './app.css';
import React from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Route, NavLink, HashRouter } from "react-router-dom";
import AskWalls from '../components/ask_walls/ask_walls';
import MarketCap from '../components/market_cap/market_cap';
import Contact from '../components/contact/contact';

const App = () => {
    return (
        <HashRouter>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand id="title" href="/">NBA Top Shot Market</Navbar.Brand>
                <Nav className="mr-auto">
                    <NavLink to="/" >Ask Walls</NavLink>
                    <NavLink to="/marketcap">Market Caps</NavLink>
                    <NavLink to="/contact">Donate/Contact</NavLink>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-info">Search</Button>
                </Form>
            </Navbar>
            <Container maxwidth="sm">
                <Route exact path="/" component={AskWalls} />
                <Route path="/marketcap" component={MarketCap} />
                <Route path="/contact" component={Contact} />
            </Container>
        </HashRouter>
    )
};


export default App;