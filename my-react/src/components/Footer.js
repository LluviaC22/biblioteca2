import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div>
        <h3>Contáctanos</h3>
        <p>
          <i className="fas fa-phone-alt"></i>
          <span>(675) 878 1053</span>
        </p>
        <p>
          <i className="fas fa-envelope"></i>
          <span>bibliotecapublicamariohugomari@gmail.com</span>
        </p>
        <p>
          <i className="fas fa-map-marker-alt"></i>
          <span>Domicilio Conocido (en el Jardín Municipal), C.P. 34850</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
