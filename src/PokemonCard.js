//this componenent is used to generate individual pokemon cards. using the data from the pokemon array

import PokemonTypes from "./PokemonTypes";
import './pokemonCard.css'

function PokemonCard({ pokemonData, viewPokemonDetails }) {
    let number = pokemonData.id
    let numberString = number.toString().padStart(4, '0')
    return (
        <>
            <div className="card" onClick={viewPokemonDetails}>
                <div className="header">
                    <div className="pokeId">#{numberString}</div>
                </div>
                <div className="cardBody">
                    <div>
                        <img className="pokeImg" src={pokemonData.sprite} alt={pokemonData.name} />
                    </div>
                </div>
                <div className="footer">
                    <div className="pokeName">{pokemonData.name}</div>
                    <PokemonTypes types={pokemonData.types} />
                </div>
            </div>
        </>
    )
}


export default PokemonCard