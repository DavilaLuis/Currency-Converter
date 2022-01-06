const dropDownStyle = {
  fontFamily: 'IBM Plex Mono',
}
const Pagination = ({ items, pageSize, onPageChange }) => {
  const { Button } = ReactBootstrap;
  if (items.length <= 1) return null;

  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num + 1);
  const list = pages.map(page => {
    return (
      <Button key={page} onClick={onPageChange} className="page-item">
        {page}
      </Button>
    );
  });
  return (
    <nav>
      <ul className="pagination">{list}</ul>
    </nav>
  );
};
const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};
function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}
function App() {
  const { useState, useEffect } = React;
  const { Dropdown, DropdownButton } = ReactBootstrap;
  const { Container } = ReactBootstrap;
  const [data, setData] = useState([]);
  const [selector, setSelector] = useState([]);
  const [url, setUrl] = useState("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json");
  const [query, setQuery] = useState("");
  const [activo, setActivo] = useState(true);
  const [indice, setIndice] = useState();
  const [mensaje, setMensaje]  = useState("Seleccione Moneda");
  const [currentPage, setCurrentPage] = useState(1);

  console.log("Rendering App");
  const pageSize = 10;
  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      const result = await axios(url);
      console.log(result);
      const {data} = result;   // adicionado para prueba
      console.log(data);
      if(activo)
      {
        const resultado = Object.entries(data).map(item   => ( { cod : item[0], name : item[1] } ));
        console.log(resultado);   // adicionado para prueba
        setSelector(resultado);
      }
      else{
        const arr  = Object.keys(data);
        const elemento = `${arr[1]}`;
        const datos = data[elemento];
        const resultado = Object.entries(datos).map(item   => ( { cod : item[0], name : item[1] } ));
        console.log("El resultado es: ");
        console.log(resultado);   // adicionado para prueba
        setData(resultado);
        setMensaje(`Moneda : ${selector[indice].name}`);
      }
      
      setActivo(false);
    };

    fetchData();
  }, [url]);
  const handlePageChange = e => {
    setCurrentPage(Number(e.target.textContent));
  };
    let page = data;
    if (page.length >= 1) {
      page = paginate(page, currentPage, pageSize);
      console.log(`currentPage: ${currentPage}`);
    }
  return (
    <Container>
      <Dropdown>
      <DropdownButton id="dropdown-basic-button" title={mensaje}>
        { selector.map( (item, index) =>
          <Dropdown.Item style={dropDownStyle} onClick={() => {
            setUrl(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${item.cod}.json`);
            setIndice(index);
            console.log(index);}
          } 
          key={index} href="#/action-1">{item.cod} - {item.name}</Dropdown.Item>)}
      </DropdownButton>
      </Dropdown>
      <br/>
       { mensaje != "Seleccione Moneda" && <h3>El tipo de cambio es:</h3>}
       <br/>
      <ul>
        {page.map(item => (
          <li style={dropDownStyle} key={item.cod}>
            <h4>{item.cod} - {item.name}</h4>
          </li>
        ))}
      </ul>
      <Pagination
        items={data}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Container>
  );
}
// ========================================
ReactDOM.render(<App />, document.getElementById("root"));

//  // "https://hn.algolia.com/api/v1/search?query=redux"
