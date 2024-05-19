//this component uses pokemon type icons stored in local and based on the pokemon type, it displays the respective icons on the pokemon card

import TypeJson from './assets/pokemonTypes.json';
import './pokemonTypes.css'

function PokemonTypes({ types }) {
  return (
    <div className='types'>
      {
        types.map((type, index) => {
          const pokeType = TypeJson.filter((item) => item.type_name === type.type.name)[0]
          return (
            <div key={index} className='iconCircle' style={{ backgroundColor: pokeType.type_color }} title={pokeType.type_name}>
              <img className='icon' src={require('./assets/type_icons/' + pokeType.type_name + '.svg')}
                alt={pokeType.type_name}></img>
            </div>
          )
        })
      }
    </div>
  );
}

export default PokemonTypes 