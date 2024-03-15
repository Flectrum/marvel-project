import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [charList, setCharlist] = useState([{id: 'zkkd34', name: 'Garrrik', description: 'Old friend with some strange history', thumbnail: 'https://scontent-hel3-1.xx.fbcdn.net/v/t31.18172-8/475015_285576211521407_1091775429_o.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=t5PXCUNxwHQAX-M7o8v&_nc_ht=scontent-hel3-1.xx&oh=00_AfDYYFKEtvZw-L6HpoGSRG9JsVMzAMrDLhcOQNJ-eOvYDw&oe=661BC8A7' }]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const {loading, error, getAllCharacters} = useMarvelService();

    // useEffect(() => {
    //     return () => {
    //         onRequest(offset, true);
    //     }
    // }, []);
    

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {
        initial ?  setNewItemLoading(false) :  setNewItemLoading(true);          
        getAllCharacters(offset)
            .then(onCharListLoaded);
    }


    const onCharListLoaded = (newCharList) => {
            setCharlist(charList => [...charList, ...newCharList]);
            setNewItemLoading(newItemLoading => false);
            setOffset( offset => offset + 9);
            setCharEnded(newCharList.length < 9 ? true : false);
        };


    const itemRefs = useRef([]);


    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = {objectFit: 'cover'};
            if(item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
               imgStyle =  {objectFit: 'unset'};
            }

            return (
                <li
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i)
                    }}
                    onKeyDown={(e) => {
                        if(e.key === ' ' || e.key === "Enter"){
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                    >
                    <img src={item.thumbnail} alt={item.name}
                    style={imgStyle}
                    />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
            return (
                <ul className="char__grid">
                    {items}
                </ul>
            )
        }

        const items = renderItems(charList);

        const spinner = loading && !newItemLoading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        
        return (
            <div className="char__list">
                    {spinner}
                    {errorMessage}
                    {items}
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}
                    >
                    <div className="inner">load more</div>
                </button>
            </div>
        )}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;