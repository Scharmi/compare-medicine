import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import './Content.css';
import List from './List/List';
import sampleData from './sampleData.json'


export interface ContentProps {
    layer: "chooseCompany" | "chooseMedicine" | "viewMedicine"
    setLayer: Function;
}
function Content(props: ContentProps) {
    const layer = props.layer
    const [searchText, setSearchText] = useState<string>("")
    const [content, setContent] = useState<Array<any>>(sampleData.sampleCompanies)
    useEffect(() => {
        //Tutaj będzie request do backendu zakończony wywołaniem setContent
        console.log("Backend request sent: " + props.layer)
        return () => {
            console.log("Component unmounted")
        }
    }, [props.layer])
    //Filtrowanie danych na podstawie searchBara
    const filter = (content: Array<any>, substring: string) => {
        return content.filter((element) => {
            return element.name.toLowerCase().includes(substring.toLowerCase())
        })
    }
    return (
        <div className="Content">
            <div className="searchBar">
                <TextField
                    id="outlined-helperText"
                    label="Wyszukaj firmę"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                />
            </div>
            <div className="table">
                <List content={filter(content, searchText)} layer={layer}/>
            </div>
        </div>
    );
}
export default Content;