import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import './Content.css';
import List from './List/List';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';


export interface ContentProps {
    layer: "chooseCompany" | "chooseMedicine" | "viewMedicine"
    setLayer: Function;
    parameters: { company: string, medicine: any};
    setParameters: Function;
}

function Content(props: ContentProps) {
    const backendAddress = "http://localhost:8000"
    const layer = props.layer
    const [searchText, setSearchText] = useState<string>("")
    const [content, setContent] = useState<Array<any>>([])
    const whatToSearch = layer === "chooseCompany" ? "firmę" : "lek"
    const [companies, setCompanies] = useState<Array<any>>([])
    const [highlightedCompany, setHighlightedCompany] = useState<string>('')
    const [gotBackendData, setGotBackendData] = useState<boolean>(false);
    let onClickFunction:Function;

    switch (layer) {
        case "chooseCompany":
            onClickFunction = (obj: any) => {
                props.setParameters({...props.parameters, company: obj.name })
                props.setLayer("chooseMedicine")
                setSearchText("")
            }
        break;
        case "chooseMedicine":
            onClickFunction = (obj: any) => {
                props.setParameters({...props.parameters, medicine: obj })
                props.setLayer("viewMedicine")
                setSearchText("")
            }
        break;
        default:
            onClickFunction = () => {}
    }

    const makeCompanyObjects = (data: Array<any>) => {
        let companies: Array<any> = [];
        data.forEach((element) => {
            companies.push({name: element})
        })
        return companies;
    }

    const compareMedicines = (a: any, b: any) => {
        if (a.price_per_unit < b.price_per_unit) {
            return -1;
        }
        if (a.price_per_unit > b.price_per_unit) {
            return 1;
        }
        return 0;
    }

    useEffect(() => {
        if(layer === "chooseCompany") {
            fetch(backendAddress + '/companies')
            .then((response) => {
                response.json().then(function(data) {
                setContent(makeCompanyObjects(data.companies.sort()));
                setGotBackendData(true);
            });
            })
            .catch((err) => {
               console.log(err);
            });
        }
        if(layer === "chooseMedicine") {
            fetch(backendAddress + '/medicines?' + new URLSearchParams({company: props.parameters.company}))
            .then((response) => {
                response.json().then(function(data) {
                setContent(data);
                setGotBackendData(true);
            });
            })
            .catch((err) => {
               console.log(err);
            });
        }
        if(layer === "viewMedicine") {
            fetch(backendAddress + '/group?' + new URLSearchParams({substance: props.parameters.medicine.substance, form: props.parameters.medicine.form, dose: props.parameters.medicine.dose}))
            .then((response) => {
                response.json().then(function(data) {
                console.log(data)
                let newSet = new Set();
                data.forEach((element: any) => {
                    newSet.add(element.company)
                })
                setGotBackendData(true);
                setCompanies(Array.from(newSet))
                setContent(data.sort(compareMedicines));
            });
            })
            .catch((err) => {
                console.log(err);
            });
        }

        return () => {
            console.log("Component unmounted")
        }
    }, [props.layer])

    const filter = (content: Array<any>, substring: string) => {
        return content.filter((element) => {
            return element.name.toLowerCase().includes(substring.toLowerCase())
        })
    }
    const renderSearchBar = () => {
        if(layer !== "viewMedicine") {
            return (
                <TextField
                    id="outlined-helperText"
                    label={"Wyszukaj " + whatToSearch}
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                />
            )
        }
        return <></>
    }
    const renderComboBoxOptions = () => {
        return companies.map((element) => {
            return <MenuItem key={element} value={element}>{element}</MenuItem>
        })
    }
    const renderComboBox = () => {
        if(layer === "viewMedicine") {
            return (
                <Box sx={{ minWidth: 240 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Podświetl leki wybranej firmy</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={highlightedCompany}
                    label="Podświetl leki wybranej firmy"
                    autoWidth
                    onChange={(event: SelectChangeEvent) => setHighlightedCompany(event.target.value)}
                  >
                    {renderComboBoxOptions()}
                  </Select>
                </FormControl>
              </Box>
            )
        }
        return <></>
    }
    const renderList = () => {
        if(gotBackendData) {
            return <List onClickFunction={onClickFunction} content={filter(content, searchText)} layer={layer} highlighted={highlightedCompany}/>
        }
        return <div>Ładowanie...</div>
    }
    return (
        <div className="Content">
            <div className="returnButton">
                <Button variant="contained" 
                    onClick={() => {props.setParameters({company: "", medicine: ""}); props.setLayer("chooseCompany")}}
                >
                Powrót do strony głównej
                </Button>
            </div>
            <div className="searchBar">
                {renderSearchBar()}
                {renderComboBox()}
            </div>
            <div className="table">
                {renderList()}
            </div>
        </div>
    );
}
export default Content;