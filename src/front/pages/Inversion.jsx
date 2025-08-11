import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, Card, Form, Table, Row, Col, Alert, Badge } from "react-bootstrap";
import CryptoWidget from "../CryptoWidget";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


export const Inversion = () => {
  const location = useLocation();
  const navigate = useNavigate();


  // Estados de inversión
  const [monthlyInvestment, setMonthlyInvestment] = useState(50);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ invested: 0, final: 0, interest: 0 });
  const [token, setToken] = useState(null); // Inicialmente null hasta verificar
  const [loading, setLoading] = useState(true); // Estado de carga

  // Función de validación
  const validateToken = (token) => {
    return token &&
      typeof token === "string" &&
      token !== "null" &&
      token !== "undefined" &&
      token.trim().length > 10;
  };

  // Efecto para verificar el token al montar el componente
  useEffect(() => {
    const checkAuth = () => {
      const savedToken = localStorage.getItem("token");
      setToken(validateToken(savedToken) ? savedToken : null);
      setLoading(false);
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Efecto para scroll
  useEffect(() => {
    if (!loading) { // Solo hacer scroll cuando haya terminado de cargar
      const anchor = location.hash.replace("#", "");
      if (anchor) {
        const element = document.getElementById(anchor);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location, loading]);

  // Sincronización con localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedToken = localStorage.getItem("token");
      setToken(validateToken(savedToken) ? savedToken : null);
    };

    // Escuchar cambios en otras pestañas
    window.addEventListener('storage', handleStorageChange);

    // Verificación inicial
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Cálculo de crecimiento 
  useEffect(() => {
    calculateGrowth();
  }, [monthlyInvestment, years, rate]);

  const calculateGrowth = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    let total = 0;
    let yearlyData = [];

    for (let i = 1; i <= n; i++) {
      total = total * (1 + r) + parseFloat(monthlyInvestment);
      if (i % 12 === 0) {
        yearlyData.push({
          year: i / 12,
          total: total.toFixed(2),
        });
      }
    }

    const totalInvested = monthlyInvestment * n;
    const finalTotal = total;
    const interestEarned = total - totalInvested;

    setResults(yearlyData);
    setTotals({
      invested: totalInvested.toFixed(2),
      final: finalTotal.toFixed(2),
      interest: interestEarned.toFixed(2),
    });
  };

  return (
    <div className="container mt-5">
        <Card className="p-4 mb-5 bg-white">
          <h3 className="mb-3">🧭 Bienvenido al Espacio de Inversión para Jóvenes</h3>
          <p className="fs-5">
            Aquí aprenderás de forma sencilla cómo empezar a invertir, con consejos prácticos,
            simuladores personalizados y explicaciones claras sobre criptomonedas, acciones
            y fondos indexados. Ideal si quieres <strong>ahorrar, invertir y ganar autonomía financiera</strong>,
            aunque partas desde cero.
          </p>
          <p className="fs-5 mb-0">
            <strong>¿Qué encontrarás aquí?</strong>
            <ul className="fs-5">
              <li>💡 Consejos clave para empezar con buen pie</li>
              <li>🧮 Un simulador interactivo de inversión a largo plazo</li>
              <li>₿ Información útil sobre criptomonedas, acciones y fondos indexados</li>
              <li>🔐 Acceso a herramientas exclusivas si estás registrado</li>
            </ul>
          </p>
        </Card>
        {/* Parte visible para todo el mundo */}
        <Card className="p-4 mb-5">
          <h4 className="mb-3">📊 Criptomonedas: ¿Oportunidad o riesgo?</h4>
          <Alert variant="warning" className="mb-3">
            <strong>Atención:</strong> Las criptos pueden subir o bajar un 50% en un día. Solo para perfiles con alta tolerancia al riesgo.
          </Alert>
          <CryptoWidget />
        </Card>

        <Card className="p-4 bg-light mb-5">
          <h4>💡 5 Reglas de oro para jóvenes inversores</h4>
          <ul className="fs-5">
            <li><strong>Empieza YA</strong>: A los 20 años, 50€/mes pueden ser 200.000€ a los 65.</li>
            <li><strong>Automatiza</strong>: Programa transferencias mensuales y olvídate.</li>
            <li><strong>Diversifica</strong>: No pongas todo en cripto (mezcla con fondos indexados).</li>
            <li><strong>Ignora el "FOMO"</strong>: Comprar porque "todo el mundo lo hace" suele acabar mal.</li>
            <li><strong>La educación supera a la suerte</strong>: Gana quien aprende, no quien apuesta.</li>
          </ul>
        </Card>

        {/* Parte privada: solo visible si hay token */}
        {token ? (
          <Card className="p-4 bg-white mb-5">
            <h4 className="mb-4">🧮 Simulador: "Si hubiera empezado a los 20 años..."</h4>

            <Alert variant="success" className="mb-4">
              <div className="d-flex">
                <div className="me-3">✨</div>
                <div>
                  <strong>El interés compuesto es magia:</strong> Si inviertes <strong>{monthlyInvestment}€/mes</strong> durante <strong>{years} años</strong> al <strong>{rate}% anual</strong>, tus <span className="text-primary">{totals.invested}€</span> invertidos se convertirían en <span className="text-success">{totals.final}€</span> (¡<span className="text-danger">+{totals.interest}€</span> de intereses!).
                </div>
              </div>
            </Alert>

            <Form className="mb-4">
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Inversión mensual (€)</Form.Label>
                    <Form.Control
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(e.target.value)}
                      min={1}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Años</Form.Label>
                    <Form.Control
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      min={1}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Rentabilidad anual (%)</Form.Label>
                    <Form.Control
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      min={0}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>

            <div style={{ width: "100%", height: 300 }} className="mb-4">
              <h5 className="text-center">Tu progreso año a año</h5>
              <ResponsiveContainer>
                <LineChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `${parseFloat(value).toFixed(2)} €`}
                    labelFormatter={(value) => `Año ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#4e73df"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <Table striped bordered hover className="mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Año</th>
                  <th>Total acumulado</th>
                  <th>Intereses ese año</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, index) => {
                  const previousTotal = index > 0 ? parseFloat(results[index - 1].total) : 0;
                  const yearlyInterest = (parseFloat(r.total) - previousTotal - monthlyInvestment * 12).toFixed(2);

                  return (
                    <tr key={r.year}>
                      <td>{r.year}</td>
                      <td>{r.total} €</td>
                      <td className={yearlyInterest > 0 ? "text-success" : "text-danger"}>
                        {yearlyInterest} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Alert variant="info" className="mt-4">
              <h5>📌 Caso práctico: María vs. Pedro</h5>
              <p>
                <strong>María (25 años):</strong> Invierte 100€/mes al 7% hasta los 65 años → <strong>264.000€</strong>.<br />
                <strong>Pedro (35 años):</strong> Empieza igual pero 10 años después → solo <strong>122.000€</strong>.<br />
                <span className="text-danger">Moraleja: 10 años de diferencia = ¡+142.000€!</span>
              </p>
            </Alert>
          </Card>
        ) : (
          <Alert variant="info" className="mt-4">
            <strong>🔒 Accede o regístrate</strong> para usar el simulador personalizado de inversión.
          </Alert>
        )}

        {/* Sección Bitcoin - Versión Mejorada */}
        <div id="bitcoin" className="mb-5">
          <h3 className="d-flex align-items-center">
            <span className="me-2">₿</span> Bitcoin: El activo más volátil del mundo
          </h3>

          <Alert variant="warning" className="border-start border-5 border-warning">
            <div className="d-flex">
              <div className="me-3">🎢</div>
              <div>
                <strong>¿Sabías que...?</strong>
                <ul className="mb-0 mt-2">
                  <li>En <span className="text-danger">2011</span> Bitcoin perdió el <strong>93%</strong> de su valor en 5 meses</li>
                  <li>En <span className="text-success">2017</span> subió un <strong>1,900%</strong> en un año</li>
                  <li>En <span className="text-danger">2022</span> empresas como Tesla perdieron <strong>1.38B €</strong> en BTC</li>
                </ul>
                <div className="mt-2 fw-bold">Regla de oro: <span className="text-info">Máximo 5% de tu portfolio</span></div>
              </div>
            </div>
          </Alert>

          <div className="mt-3">
            <p>La primera criptomoneda (2009) funciona como:</p>
            <ul>
              <li>🛡️ <strong>Antiinflación:</strong> Solo existirán 21 millones (17m ya circulan)</li>
              <li>🌎 <strong>Sin fronteras:</strong> Transfiere valor a cualquier país en minutos</li>
              <li>⚡ <strong>Sin intermediarios:</strong> Bancos y gobiernos no pueden congelar tu dinero</li>
            </ul>
          </div>

          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header className="fw-bold">📲 Guía práctica: Primeros pasos</Accordion.Header>
              <Accordion.Body>
                <div className="row">
                  <div className="col-md-6">
                    <strong>📈 Dónde comprar:</strong>
                    <div className="mt-2">
                      <Badge bg="success" className="me-2 mb-2">Binance</Badge>
                      <Badge bg="primary" className="me-2 mb-2">Coinbase</Badge>
                      <Badge bg="dark" className="me-2 mb-2">Kraken</Badge>
                    </div>

                    <div className="mt-3">
                      <strong>🔐 Wallets seguras:</strong>
                      <ul className="mt-2">
                        <li>Ledger Nano X (€149)</li>
                        <li>Trezor Model T (€189)</li>
                        <li>Exodus (gratis)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <strong>💣 Riesgos reales:</strong>
                    <ul>
                      <li>Exchange hackeado (FTX perdió 7.36B € en 2022)</li>
                      <li>Olvidar contraseñas (se pierden 9.2B € en BTC)</li>
                      <li>Estafas (30% de proyectos crypto son fraudes)</li>
                    </ul>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        {/* Sección Acciones - Versión Mejorada */}
        <div id="acciones" className="mb-5">
          <h3>📈 Acciones: Conviértete en dueño parcial de empresas</h3>

          <Alert variant="primary" className="border-start border-5 border-primary">
            <div className="d-flex">
              <div className="me-3">📊</div>
              <div>
                <strong>El poder del largo plazo:</strong>
                <div className="mt-2">
                  <span className="d-block">9,200€ invertidos en...</span>
                  <div className="d-flex flex-wrap mt-2">
                    <Badge bg="success" className="me-2 mb-2">Amazon (2001): 2,208,000€</Badge>
                    <Badge bg="danger" className="me-2 mb-2">Enron (2001): 0€</Badge>
                    <Badge bg="success" className="me-2 mb-2">Apple (1980): 6,440,000€ </Badge>
                    <Badge bg="warning" className="me-2 mb-2">GameStop (2014): 276€</Badge>
                  </div>
                </div>
                <div className="mt-2 fw-bold">Clave: <span className="text-success">Diversifica + Invierte en lo que entiendas</span></div>
              </div>
            </div>
          </Alert>

          <div className="mt-3">
            <p>Cuando compras acciones:</p>
            <ul>
              <li>📌 <strong>Eres copropietario:</strong> Participas en ganancias (dividendos)</li>
              <li>📅 <strong>El tiempo es tu aliado:</strong> Mercado sube un 70% de los años</li>
              <li>💡 <strong>Información = Ventaja:</strong> Analiza balances y tendencias</li>
            </ul>
          </div>

          <Accordion>
            <Accordion.Item eventKey="1">
              <Accordion.Header className="fw-bold">🚀 Estrategias para empezar</Accordion.Header>
              <Accordion.Body>
                <div className="row">
                  <div className="col-md-6">
                    <strong>📱 Apps recomendadas:</strong>
                    <ul className="mt-2">
                      <li><span className="text-success">eToro:</span> Copia a inversores expertos</li>
                      <li><span className="text-primary">Degiro:</span> Comisiones desde €0.50</li>
                      <li><span className="text-info">Interactive Brokers:</span> Profesional (más complejo)</li>
                    </ul>

                    <div className="mt-3">
                      <strong>📚 Libros esenciales:</strong>
                      <ul>
                        <li>"El Inversor Inteligente" - Benjamin Graham</li>
                        <li>"Un paseo aleatorio por Wall Street" - Burton Malkiel</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <strong>⚠️ Errores comunes:</strong>
                    <ul>
                      <li>Comprar por hype (memestocks)</li>
                      <li>Vender por pánico (caídas temporales)</li>
                      <li>Invertir con dinero prestado</li>
                      <li>No reinvertir dividendos</li>
                    </ul>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        {/* Sección Fondos Indexados - Versión Mejorada */}
        <div id="fondos" className="mb-5">
          <h3>🌍 Fondos Indexados: La autopista hacia la libertad financiera</h3>

          <Alert variant="success" className="border-start border-5 border-success">
            <div className="d-flex">
              <div className="me-3">👑</div>
              <div>
                <strong>Warren Buffett lo tiene claro:</strong>
                <div className="mt-2">
                  "Después de mi muerte, el 90% de mi fortuna irá a un <span className="text-success">fondo indexado del S&P 500</span>.
                  Es la mejor opción para la mayoría de inversores."
                </div>
                <div className="mt-2">
                  <small>Buffett apostó 1 millón y ganó: los fondos indexados lo hicieron mejor que los hedge funds en esos 10 años</small>
                </div>
              </div>
            </div>
          </Alert>

          <div className="mt-3">
            <p>¿Por qué son revolucionarios?</p>
            <ul>
              <li>🤖 <strong>Automatización:</strong> Inviertes en 500+ empresas sin esfuerzo</li>
              <li>💸 <strong>Bajas comisiones:</strong> 0.20% vs 2% de los bancos</li>
              <li>📈 <strong>Rentabilidad probada:</strong> +10% anual promedio (S&P 500)</li>
            </ul>
          </div>

          <Accordion>
            <Accordion.Item eventKey="2">
              <Accordion.Header className="fw-bold">🛌 Cómo implementarlo en 3 pasos</Accordion.Header>
              <Accordion.Body>
                <div className="row">
                  <div className="col-md-6">
                    <strong>1️⃣ Elige tu fondo:</strong>
                    <ul className="mt-2">
                      <li><span className="text-success">Vanguard S&P 500</span> (IE00B3XXRP09)</li>
                      <li><span className="text-primary">iShares MSCI World</span> (IE00B4L5Y983)</li>
                      <li><span className="text-info">Amundi Prime Global</span> (LU2089238204)</li>
                    </ul>

                    <div className="mt-4">
                      <strong>2️⃣ Plataformas low-cost:</strong>
                      <ul>
                        <li>Indexa Capital (España)</li>
                        <li>MyInvestor (Vanguard)</li>
                        <li>Boggleheads (comunidad)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <strong>3️⃣ Estrategia infalible:</strong>
                    <ol>
                      <li>Destina un % fijo de tu sueldo (ej. 15%)</li>
                      <li>Automatiza las compras mensuales</li>
                      <li>Olvídate durante 20+ años</li>
                      <li>Revisa solo 1 vez al año</li>
                    </ol>

                    <div className="alert alert-info mt-3">
                      <strong>💡 Ejemplo real:</strong> 460€/mes durante 30 años al 7% = <span className="text-success">563.040€</span>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
        <Card className="p-5 mb-5" style={{ background: "linear-gradient(135deg, #f0f4ff, #e9f7ef)" }}>
          <h3 className="mb-3">🚀 Da el primer paso hacia tu libertad financiera</h3>
          <p className="fs-5 text-muted">
            No hace falta ser un experto. Empieza con pequeñas cantidades, sé constante y deja que el interés compuesto haga su magia.
          </p>

          <ul className="fs-5 mb-4 text-muted">
            <li>🪙 Aprende a invertir desde cero</li>
            <li>📈 Simula tu crecimiento a largo plazo</li>
            <li>🔍 Explora opciones reales y seguras</li>
          </ul>

          {!token && (
            <div className="text-center">
              <button
                className="btn btn-primary btn-lg px-4 py-2 rounded-pill shadow-sm"
                onClick={() => navigate("/login")}
              >
                🔐 Inicia sesión para usar el simulador
              </button>
            </div>
          )}
        </Card>
      </div>
      );
};


