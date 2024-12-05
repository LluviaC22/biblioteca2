import React from 'react';
import './Inicio.css';
import Carousel from 'react-bootstrap/Carousel';
// Importación de imágenes
import slider1 from './assets/slider1.jpeg';
import slider2 from './assets/slider2.jpeg';
import slider3 from './assets/slider3.jpeg';
import slider4 from './assets/slider4.jpeg';
import slider8 from './assets/slider8.jpeg';
import slider10 from './assets/slider10.jpeg';
import slider11 from './assets/slider11.jpeg';
import cursos1 from './assets/cursos1.jpeg';
import cursos2 from './assets/cursos2.jpeg';
import cursos3 from './assets/cursos3.jpeg';

const Inicio = () => {
  return (
    <div className="inicio-container">
      {/* Texto de bienvenida */}
      <div className="welcome-text">
        <h1>Bienvenidos a la Biblioteca</h1>
        <p>
          ¡Te damos la bienvenida a la Biblioteca Mario Hugo Marino Ortiz! Nuestra misión es brindarte un espacio enriquecedor para explorar el mundo a través de los libros y la educación. Ya sea que busques tu próxima lectura favorita, te interesen nuestros cursos de verano o simplemente quieras disfrutar de un ambiente inspirador, aquí encontrarás todo lo que necesitas. ¡Explora, aprende y crece con nosotros!
        </p>
      </div>

      {/* Sala Infantil */}
      <div className="sala-section">
        <h2>Sala Infantil</h2>
        <div className="slider-container">
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src={slider1} alt="Primera imagen" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={slider2} alt="Segunda imagen" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={slider3} alt="Tercera imagen" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={slider4} alt="Cuarta imagen" />
            </Carousel.Item>
          </Carousel>
        </div>
        <p>
          "La Sala Infantil es un lugar mágico donde los más pequeños pueden descubrir el placer de la lectura y desarrollar habilidades clave como la comprensión lectora, la creatividad y la concentración desde una edad temprana. Además de nuestra variada selección de libros, ofrecemos actividades interactivas, como cuentacuentos, talleres de manualidades, juegos educativos y sesiones de teatro. Cada actividad está diseñada para fomentar el amor por la lectura y el aprendizaje de manera divertida y significativa."
        </p>
      </div>

      {/* Sala General */}
      <div className="sala-section">
        <h2>Sala General</h2>
        <div className="slider-container">
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src={slider8} alt="Sala General 1" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={slider10} alt="Sala General 2" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={slider11} alt="Sala General 3" />
            </Carousel.Item>
          </Carousel>
        </div>
        <p>
          "La Sala General de la Biblioteca Mario Hugo Marino Ortiz es un espacio diseñado para todo tipo de lectores. Es el lugar perfecto para quienes buscan tranquilidad y concentración, ya sea para la investigación académica o el placer de la lectura. Además, la sala ofrece acceso a computadoras con conexión a internet, Wi-Fi gratuito y cómodas áreas de estudio que fomentan la concentración."
        </p>
      </div>

      {/* Cursos de Verano */}
      <div className="sala-section">
        <h2>Cursos de Verano</h2>
        <div className="slider-container">
          <Carousel>
            <Carousel.Item>
              <img className="d-block w-100" src={cursos1} alt="Cursos de Verano 1" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={cursos2} alt="Cursos de Verano 2" />
            </Carousel.Item>
            <Carousel.Item>
              <img className="d-block w-100" src={cursos3} alt="Cursos de Verano 3" />
            </Carousel.Item>
          </Carousel>
        </div>
        <p>
          "Los Cursos de Verano de la Biblioteca Mario Hugo Marino Ortiz están pensados especialmente para estudiantes de preescolar, primaria, secundaria y preparatoria. Con actividades que incluyen talleres de lectura, escritura creativa, y actividades artísticas, ofrecemos una experiencia educativa enriquecedora durante las vacaciones. ¡Ven y descubre todo lo que puedes aprender mientras te diviertes este verano!"
        </p>
      </div>
    </div>
  );
};

export default Inicio;