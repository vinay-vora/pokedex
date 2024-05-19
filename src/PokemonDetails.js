//this component displays individual pokemon details based on user selection

import axios from "axios";
import { useEffect, useState } from "react";
import PokemonTypes from "./PokemonTypes"
import './pokemonDetails.css'
import { useParams, useNavigate } from "react-router-dom";

let pokemonSpeciesUrl = "https://pokeapi.co/api/v2/pokemon-species/"

async function getPokemonDescription(id) {      //this fetches description for the selected pokemon and adds it to the pokemon details
    const pokemonSpeciesData = await axios.get(pokemonSpeciesUrl + id + '/')
    return (pokemonSpeciesData.data.flavor_text_entries[6].flavor_text)
}
function PokemonDetails({ rawPokemonData, totalPokemons, onPokemonChange }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pokemonDetails, setPokemonDetails] = useState(rawPokemonData)

    useEffect(() => {
        async function updatePokemonDescription(pokemonData) {
            let response = String(await getPokemonDescription(pokemonData.id)).toLowerCase().replace(/[\r\n\f]+/gm, " ")  //remove newline characters and form feed characters from a string, replacing them with a single space.
            let pokemonDescription = response.charAt(0).toUpperCase() + response.slice(1)
            setPokemonDetails({ ...pokemonData, description: pokemonDescription });
        }
        onPokemonChange(rawPokemonData.id ? rawPokemonData.id : id)
        rawPokemonData && rawPokemonData.id && updatePokemonDescription(rawPokemonData)
    }, [rawPokemonData, id, onPokemonChange])

    function handleNavigationClick(type, currentId) {      //updates pokemon details to next or previous pokemon 
        let navId = currentId
        if (type === 'prev') {
            navId = pokemonDetails.id <= 1 ? totalPokemons : pokemonDetails.id - 1
        } else if (type === 'next') {
            navId = totalPokemons === pokemonDetails.id ? 1 : pokemonDetails.id + 1
        }
        onPokemonChange(navId)
        navigate(`/pokemonDetails/${navId}`)
    }

    let numberString = (id).toString().padStart(4, '0')  //converts pokemon id to a string of format #0001, #00100
    if (!pokemonDetails || !pokemonDetails.id) {        //loader
        return (
            <>
                <img style={{width: '100px', alignSelf: 'center'}}  src={require('./assets/loadingGif.gif')}></img>
            </>
        )
    } else {
        return (
            <>
                <div style={{ backgroundColor: '#E1191A', padding: '24px', textAlign: 'center' }}>
                    <button style={{ float: 'left' }} className="nextPrev" onClick={() => handleNavigationClick('prev', pokemonDetails.id)}><i className="fa fa-angle-left"></i>#{(pokemonDetails.id <= 1 ? totalPokemons : pokemonDetails.id - 1).toString().padStart(4, '0')}</button>
                    <button style={{ float: 'right' }} className="nextPrev" onClick={() => handleNavigationClick('next', pokemonDetails.id)} >#{(totalPokemons === pokemonDetails.id ? 1 : pokemonDetails.id + 1).toString().padStart(4, '0')}<i className="fa fa-angle-right"></i></button>
                </div>
                <div className="details">
                    <div className="leftSection">
                        <div>
                            <img className="pokeDetImg" src={pokemonDetails.sprite} alt={pokemonDetails.name} />
                            <div className="pokeTypes"><PokemonTypes types={pokemonDetails.types} /></div>
                            <div className="measurements">
                                <div className="measurement">
                                    <div className="measureHeading">Weight</div>
                                    <div className="measureValue">{pokemonDetails.weight / 10}Kg</div>
                                </div>
                                <div className="measurement">
                                    <div className="measureHeading">Height</div>
                                    <div className="measureValue">{pokemonDetails.height / 10}m</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rightSection">
                        <div className="description">
                            <div className="pokeDetName">{pokemonDetails.name}</div>
                            <div className="pokeDetId">#{numberString}</div>
                            <div className="pokeDesc">{pokemonDetails.description}</div>
                        </div>
                        <div className="stats">
                            {
                                pokemonDetails.stats.map((stat) => {
                                    return (
                                            <div className="stat" key={stat.stat.name}>
                                                <div className="statGroup">
                                                    <div className="statName">{(stat.stat.name).charAt(0).toUpperCase() + (stat.stat.name).slice(1)}</div>
                                                    <div className="statValue">{stat.base_stat}</div>
                                                </div>
                                                <progress className="progressBar" value={stat.base_stat} min={0} max={200} />
                                            </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default PokemonDetails