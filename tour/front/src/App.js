import axios from "axios";
import { React, useEffect, useState, useContext, createContext } from "react";
import {
  Routes,
  BrowserRouter as Router,
  Route,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import InputGroup from "react-bootstrap/InputGroup";
import Carousel from "react-bootstrap/Carousel";
import russia from "./img/russia.png";
import vladimir from "./img/vladimir.jpg";
import lodka from "./img/lodka.jpg"
import { BagPlus, BagDash, Trash, PlusLg, DashLg } from "react-bootstrap-icons";
const BasketContext = createContext();
const UserContext = createContext();

const Home = () => {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={russia}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={vladimir}
          alt="Second slide"
        />

      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={lodka}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

const CollapsibleExample = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() =>
    localStorage.getItem("token")
      ? setToken(localStorage.getItem("token"))
      : setToken("")
  );

  return (
    <Navbar collapseOnSelect bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ?????? ????????
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/catalog/">
              ??????????????
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/basket/">
              ??????????????
            </Nav.Link>
            {token ? (
              <Button onClick={() => logOut()}>??????????</Button>
            ) : location.pathname === "/user/registration/" ||
              location.pathname === "/user/authorization/" ? null : (
              <Nav.Link as={Link} to="/user/registration/">
                ??????????????????????
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const BasicExample = () => {
  const location = useLocation();
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const registration = async ({ email, password }) => {
    await axios
      .post("http://localhost:3008/user/registration/", { email, password })
      .then((res) => {})
      .catch((err) => {
        console.log(err.response);
      });
  };
  const authorization = async ({ email, password }) => {
    await axios
      .post("http://localhost:3008/user/authorization/", { email, password })
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const sendValue = (e) => {
    e.preventDefault();
    if (location.pathname === "/user/registration/") {
      registration(value);
    } else if (location.pathname === "/user/authorization/") {
      authorization(value);
    }
    setValue({ ...value, email: "", password: "" });
    navigate("/");
  };

  return (
    <Container className="w-50">
      <Form onSubmit={sendValue}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>??????????</Form.Label>
          <Form.Control
            type="email"
            placeholder="??????????"
            required
            value={value.email}
            onChange={(e) => setValue({ ...value, email: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>????????????</Form.Label>
          <Form.Control
            type="password"
            placeholder="????????????"
            required
            value={value.password}
            onChange={(e) => setValue({ ...value, password: e.target.value })}
          />
          {location.pathname === "/user/registration/" ? (
            <Form.Text as={Link} to="/user/authorization/">
              ?????? ?????????????????????????????????
            </Form.Text>
          ) : (
            <Form.Text as={Link} to="/user/registration/">
              ?????? ???? ?????????????????????????????????
            </Form.Text>
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          ????????
        </Button>
      </Form>
    </Container>
  );
};

const Catalog = () => {
  const [catalog, setCatalog] = useState([]);
  const { basketId, setBasketId } = useContext(BasketContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const getCatalog = async () => {
    await axios
      .get("http://localhost:3008/catalog/")
      .then((res) => {
        setCatalog(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const deleteTour = async (id) => {
    await axios
      .post(
        "http://localhost:3008/deleteTour",
        { id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err.response);
      });
    getCatalog();
  };

  useEffect(() => {
    getCatalog();
  }, []);

  return (
    <Container>
      <Row>
        {catalog.map((item, index) => (
          <Card key={index} style={{ width: "18rem" }}>
            <Card.Body>
              <Card.Title>
                {item.tittle + " "}
                {basketId.find((product) => product._id === item._id) ? (
                  <Badge bg="primary">
                    {basketId.map((product) =>
                      product._id === item._id ? product.count : null
                    )}
                  </Badge>
                ) : null}
              </Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroup.Item>????????: {item.price}</ListGroup.Item>
              <ListGroup.Item>
                ?????????? ????????????????: {item.departureCity}
              </ListGroup.Item>
              <ListGroup.Item>
                ?????????? ????????????????: {item.arrivalCity}
              </ListGroup.Item>
            </ListGroup>
            <Card.Body>
              {basketId.find((product) => product._id === item._id) ? null : (
                <BagPlus
                  onClick={() =>
                    setBasketId([...basketId, { _id: item._id, count: 1 }])
                  }
                />
              )}

              {user ? (
                user.role === "admin" ? (
                  <Trash onClick={() => deleteTour(item._id)} />
                ) : null
              ) : null}
            </Card.Body>
          </Card>
        ))}
      </Row>
      {user ? (
        user.role === "admin" ? (
          <Button className="my-3" onClick={() => navigate("/addTour/")}>
            ???????????????? ??????
          </Button>
        ) : null
      ) : null}
    </Container>
  );
};

const Basket = () => {
  const { basketId, setBasketId } = useContext(BasketContext);
  const {user} = useContext(UserContext);
  const [basket, setBasket] = useState([]);

  const buy = async (basketId) => {
    await axios
      .post(
        "http://localhost:3008/buy/",
        { basketId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err.response);
      });
  };

  const getBasket = async () => {
    await axios
      .post("http://localhost:3008/basket/", { basketId })
      .then((res) => {
        setBasket(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    getBasket();
  }, [basketId]);

  return (
    <Container className="w-50">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="w-50">????????????????</th>
            <th>????????????????????</th>
            <th>????????</th>
          </tr>
        </thead>
        <tbody>
          {basket.map((item, index) => (
            <tr key={index}>
              <td>{item.tittle}</td>
              <td>
                <InputGroup>
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      setBasketId(
                        basketId.map((product) =>
                          product._id === item._id
                            ? { ...product, count: product.count + 1 }
                            : product
                        )
                      )
                    }
                  >
                    <PlusLg />
                  </Button>
                  <Form.Control
                    aria-label="Example text with button addon"
                    aria-describedby="basic-addon1"
                    {...(basketId.find((product) => product._id === item._id)
                      ? {
                          value: basketId.find(
                            (product) => product._id === item._id
                          ).count,
                        }
                      : {
                          value: "",
                        })}
                    onChange={(e) =>
                      setBasketId(
                        basketId.map((product) =>
                          product._id === item._id
                            ? { ...product, count: Number(e.target.value) }
                            : product
                        )
                      )
                    }
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      setBasketId(
                        basketId.map((product) =>
                          product._id === item._id
                            ? { ...product, count: product.count - 1 }
                            : product
                        )
                      )
                    }
                  >
                    <DashLg />
                  </Button>
                </InputGroup>
              </td>
              <td>
                {basketId.map((product) =>
                  product._id === item._id
                    ? product.count * item.price + " ??????."
                    : null
                )}
              </td>
              <td>
                {
                  <BagDash
                    onClick={() =>
                      setBasketId(
                        basketId.filter((product) => product._id !== item._id)
                      )
                    }
                  />
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => buy(basketId)}>???????????? ??????</Button>
    </Container>
  );
};

const AddTour = () => {
  const [value, setValue] = useState({
    tittle: "",
    price: "",
    departureCity: "",
    arrivalCity: "",
  });

  const addTour = async ({ tittle, price, departureCity, arrivalCity }) => {
    await axios
      .post(
        "http://localhost:3008/addTour/",
        {
          tittle,
          price,
          departureCity,
          arrivalCity,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err.response);
      });
  };

  const sendValue = (e) => {
    e.preventDefault();
    addTour(value);
    setValue({
      ...value,
      tittle: "",
      price: "",
      departureCity: "",
      arrivalCity: "",
    });
  };

  return (
    <Container className="w-50 my-3">
      <Form onSubmit={sendValue}>
        <Form.Group className="mb-3">
          <Form.Label>????????????????</Form.Label>
          <Form.Control
            onChange={(e) => setValue({ ...value, tittle: e.target.value })}
            value={value.tittle}
            placeholder="????????????????"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>????????</Form.Label>
          <Form.Control
            onChange={(e) => setValue({ ...value, price: e.target.value })}
            value={value.price}
            placeholder="????????"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>?????????? ??????????????????????</Form.Label>
          <Form.Control
            onChange={(e) =>
              setValue({ ...value, departureCity: e.target.value })
            }
            value={value.departureCity}
            placeholder="?????????? ????????????????"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>?????????? ????????????????</Form.Label>
          <Form.Control
            onChange={(e) =>
              setValue({ ...value, arrivalCity: e.target.value })
            }
            value={value.arrivalCity}
            placeholder="?????????? ????????????????"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          ????????
        </Button>
      </Form>
    </Container>
  );
};

const Footer = () => {
  return (
    <Container>
      <Navbar.Brand as={Link} to="/">
        ?????? ????????
      </Navbar.Brand>
      <p></p>
      <p>
        ?????????????????? ?????????? ?? 2022 ???????????????????????? ?????????????? ??.???????????????? ?????? ??????????
        ???????????????? ?????? ?????????????????? ???? ?????????? ?????????? ????????????????????, ????????????????????????????
        ???????????????? ?? ???? ???????????????? ?????????????????? ??????????????!
      </p>
    </Container>
  );
};

const App = () => {
  const [basketId, setBasketId] = useState([]);
  const [user, setUser] = useState();

  const getUser = async () => {
    const token = localStorage.getItem("token");
    await axios
      .get("http://localhost:3008/user/getUser/", {
        headers: { authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <BasketContext.Provider value={{ basketId, setBasketId }}>
      <UserContext.Provider value={{ user }}>
        <Router>
          <CollapsibleExample />
          <div className="main my-3">
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route
                path="/user/registration/"
                element={<BasicExample />}
              ></Route>
              <Route
                path="/user/authorization/"
                element={<BasicExample />}
              ></Route>
              <Route path="/catalog/" element={<Catalog />}></Route>
              <Route path="/basket/" element={<Basket />}></Route>
              <Route path="/addTour/" element={<AddTour />}></Route>
            </Routes>
          </div>
          <Footer />
        </Router>
      </UserContext.Provider>
    </BasketContext.Provider>
  );
};

export default App;
