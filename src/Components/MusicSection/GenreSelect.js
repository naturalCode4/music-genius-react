import React, {useState} from "react"
import {genreList} from '../../utilities/utilities.js'
// import '../../css/GenreSelect.css'

function GenreSelect({selectedGenre, setSelectedGenre}) {

    const [showGenreDropdown, setShowGenreDropdown] = useState(false)

    return (
        <div id="genre_select">
            <p id="genre_name" className="filter_name text_3D">GENRE</p>
            <div
                id="genre_dropdown"
            >
                <div
                    onMouseEnter={() => setShowGenreDropdown(true)}
                    onMouseLeave={() => setShowGenreDropdown(false)}
                >
                    <input
                        id="genre_select_input"
                        type="text"
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        disabled
                    />
                    {true && <div id="genre_dropdown_content">
                        <div>
                            {genreList.map(genre => {
                                return (
                                    <GenreSelectItem 
                                        genre={genre} 
                                        setSelectedGenre={setSelectedGenre} 
                                    />
                                )
                            })}
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}

function GenreSelectItem({ genre, setSelectedGenre }) {

    const [isHovered, setIsHovered] = useState(false);

    return (
    <div 
        className={`${isHovered ? 'genre_item_on_hover' : 'genre_item'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setSelectedGenre(genre)}
      >{genre}
    </div>
    )
}

export default GenreSelect