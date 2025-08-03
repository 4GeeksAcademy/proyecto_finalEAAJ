import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, Card, Form, Table, Row, Col, Alert } from "react-bootstrap";
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

  const [token, setToken] = useState(null);
  const [monthlyInvestment, setMonthlyInvestment] = useState(50);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(6);
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ invested: 0, final: 0, interest: 0 });

  useEffect(() => {
    const anchor = location.hash.replace("#", "");
    if (anchor) {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
  const savedToken = localStorage.getItem("token");
  if (savedToken && savedToken.length > 10) {
    setToken(savedToken);
  }
}, []);

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
          <li><strong>Educación > Suerte</strong>: Gana quien aprende, no quien apuesta.</li>
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

      {/* Secciones educativas comunes */}
      <div id="bitcoin" className="mb-5">
        <h3>₿ Bitcoin: ¿La nueva oro digital?</h3>
        <Alert variant="warning">
          <strong>Para valientes:</strong> En 2017 bajó un 80%, en 2021 subió un 1,000%. No es para ahorrar, es para especular.
        </Alert>
        <p>
          Creada en 2009 por "Satoshi Nakamoto", es la primera criptomoneda. Sin bancos, sin gobiernos, limitada a 21 millones.
        </p>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>📚 ¿Cómo empezar con Bitcoin?</Accordion.Header>
            <Accordion.Body>
              <strong>Plataformas para comprar:</strong> Binance, Coinbase, Kraken.<br />
              <strong>Cómo almacenarla:</strong> En un "wallet" (Ledger, Trezor).<br />
              <strong>Riesgos:</strong> Hackeos, estafas, volatilidad extrema.<br />
              <strong>Dato curioso:</strong> En 2010, 10,000 BTC valían 2 pizzas. Hoy: +400 millones €.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <div id="acciones" className="mb-5">
        <h3>📈 Acciones: Ser dueño de empresas</h3>
        <p>
          Comprar acciones de Apple, Tesla o Inditex es como tener un trocito de esa empresa. Si sube su valor, tú ganas.
        </p>
        <Accordion>
          <Accordion.Item eventKey="1">
            <Accordion.Header>🚀 ¿Dónde comprar acciones?</Accordion.Header>
            <Accordion.Body>
              <strong>Para principiantes:</strong> eToro, Degiro, MyInvestor.<br />
              <strong>Estrategia simple:</strong> Comprar y mantener años ("Buy & Hold").<br />
              <strong>Ejemplo histórico:</strong> 10,000€ en Amazon en 2010 = +1,000,000€ hoy.<br />
              <strong>Cuidado:</strong> No inviertas en lo que no entiendas (¡las memestocks arruinan!).
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <div id="fondos" className="mb-5">
        <h3>🌍 Fondos indexados: El "Set & Forget"</h3>
        <Alert variant="success">
          <strong>Recomendado por Warren Buffett:</strong> "Invierte en un fondo indexado del S&P 500 y sigue con tu vida".
        </Alert>
        <p>
          Un fondo que replica el mercado entero (como el S&P 500). Bajas comisiones, diversificación automática.
        </p>
        <Accordion>
          <Accordion.Item eventKey="2">
            <Accordion.Header>🛌 ¿Por qué son perfectos para jóvenes?</Accordion.Header>
            <Accordion.Body>
              <strong>Ventajas:</strong><br />
              - No necesitas elegir empresas (inviertes en 500+ a la vez).<br />
              - Comisiones bajas (0.20% vs. 2% en fondos activos).<br />
              - Histórico: +8% anual promedio en 50 años.<br /><br />
              <strong>Dónde comprar:</strong> Indexa Capital, MyInvestor, Vanguard.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};


