import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PokemonData from "./PokemonData";
import PokemonDetails from "./PokemonDetails";
import pokemonLogo from './assets/International_Pokémon_logo.svg'

async function fetchPokemonData(currentRecords, limitRecords) {   //get list of pokemon from api, convert it in required format and add it into array
  let tempArray = [];
  let pokemonDataUrl = "https://pokeapi.co/api/v2/pokemon/?limit=" + limitRecords + "&offset=" + currentRecords;
  try {
    const res = await axios.get(pokemonDataUrl);
    let responseArray = res.data.results;
    const pokemonPromises = responseArray.map(async (element) => {
      try {
        const response = await axios.get(element.url);
        let pokemondetails = response.data;
        element['name'] = (element.name).charAt(0).toUpperCase() + (element.name).slice(1)
        element['id'] = pokemondetails.id;
        element['height'] = pokemondetails.height;
        element['weight'] = pokemondetails.weight;
        element['sprite'] = pokemondetails.sprites.other.dream_world.front_default;
        element['types'] = pokemondetails.types;
        element['stats'] = pokemondetails.stats;
        tempArray.push(element);
      } catch (error) {
        console.log(error);
      }
    });

    await Promise.all(pokemonPromises);
    return tempArray;
  } catch (err) {
    console.log(err);
    return tempArray;
  }
}

function App() {
  const [pokemonDataArray, setPokeArray] = useState([])   //data of all pokemons is stored here
  const [selectedPokemonDetails, setSelection] = useState('') //data of pokemon selected from the list is stored here
  async function fetchData(id) {    
    if (id > 20) {
      let data = await fetchPokemonData(0, id)
      return data
    } else {
      let data = await fetchPokemonData(0, 20)
      return data
    }
  }
  function handleselection(data) {
    setSelection(data)
  }
  async function refreshPokemonDetails(pokemonId) {   //function called by other components to change the selected pokemon
    if (pokemonDataArray.length === 0 || pokemonDataArray.filter((pokemonData) => pokemonData.id === Number(pokemonId)).length === 0) {
      let data = await fetchData(pokemonId)
      setPokeArray(data)
      let newData = data.filter((pokemonData) => pokemonData.id === Number(pokemonId))[0]
      setSelection(newData);
    }
    else {
      let newData = pokemonDataArray.filter((pokemonData) => pokemonData.id === Number(pokemonId))[0]
      setSelection(newData);
    }
  }
  async function handleScroll(event) {    //function used to impliment infinite scroll
    let target = event.target
    if (target.scrollHeight - target.scrollTop < target.clientHeight + 1) {
      let data = await fetchPokemonData(pokemonDataArray.length)
      setPokeArray([...pokemonDataArray, ...data])
    }
  }
  useEffect(() => {
    fetchData(100).then(data => setPokeArray(data))
  }, []);
  return (
    <>
      <BrowserRouter>
        <div style={{ paddingBlock: "15px", textAlign: "center", background: "white", width: "100%", position: "sticky", top: "0" }}>
          <Link to='/pokemonList'>
            <img src={pokemonLogo} alt="International Pokemon logo" />
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 82px)" }}>
          <Routes>
            <Route path="/pokemonList" element={<PokemonData pokemonDataArray={pokemonDataArray} onshowDetails={handleselection} onPageScroll={handleScroll} />} />   {/*this component displays list of all the pokemons fetched from poke API*/}
            <Route path="pokemonDetails/:id" element={<PokemonDetails rawPokemonData={selectedPokemonDetails} totalPokemons={pokemonDataArray.length} onPokemonChange={refreshPokemonDetails} />} />  {/*this component displays details of individual pokemon selected from list*/}
            <Route path="*" element={<PokemonData pokemonDataArray={pokemonDataArray} onshowDetails={handleselection} onPageScroll={handleScroll} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
export default App;
