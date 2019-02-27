import React from 'react';
import { Image } from 'react-bootstrap/lib';

import NotebookLogo from '../../assets/images/notebook-logo.png';
import '../../assets/CSS/Logo.css';


const logo = (props) => (
    <Image src={NotebookLogo} className={props.className} />
);

export default logo;