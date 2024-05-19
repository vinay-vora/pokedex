//this component loops over pokemonCard component to view list of all the pokemon in the array 

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PokemonCard from "./PokemonCard";

function PokemonData({ pokemonDataArray, onshowDetails, onPageScroll }) {
    const [searchText, setSearchText] = useState('')
    const navigate = useNavigate()

    function showPokemonDetails(data) {     //displays details of the pokemon selected by the user
        navigate(`/pokemonDetails/${data.id}`)
        onshowDetails(data)
    }

    if (!pokemonDataArray) {    //loader
        return (
            <>
                <img style={{ width: '100px', alignSelf: 'center' }} src={require('./assets/loadingGif.gif')}></img>
            </>
        )
    } else {
        return (
            <>
                <div style={{ backgroundColor: '#E1191A', paddingBlock: '24px', textAlign: 'center', width: "100%" }}>
                    <input type="text" style={{ padding: '10px', width: '70%', maxWidth: '500px', borderRadius: '4px', border: 'none', fontSize: '16px' }} placeholder="Search Pokemon" onChange={(e) => setSearchText(e.target.value)} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", height: "100px", overflowY: "scroll", flex: "1", paddingBlock: "12px" }} onScroll={(e) => onPageScroll(e)}>
                    {
                        pokemonDataArray
                            .filter((pokemon) => { return pokemon.name.toLowerCase().includes(searchText.toLowerCase()) })
                            .map((pokemon) => {
                                return <PokemonCard key={pokemon.id} pokemonData={pokemon} viewPokemonDetails={() => showPokemonDetails(pokemon)} />
                            }
                            )
                    }
                </div>
            </>
        )
    }
}

export default PokemonData