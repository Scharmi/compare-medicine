import React, { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import './Content.css';
import List from './List/List';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import BlockLoader from './BlockLoader/BlockLoader';
import Graph from './Graph/Graph';

export interface ContentProps {
    layer: "chooseCompany" | "chooseMedicine" | "viewMedicine"
    setLayer: Function;
}
interface ContentState {
    companies: Array<any>
    medicines: Array<any>
    medicineClass: Array<Array<any>>
}
function Content(props: ContentProps) {
    const [parameters, setParameters] = useState<{company: string, medicine: string}>({company: "", medicine: ""})
    const backendAddress = "https://mimuw-io-be2.onrender.com"
    const layer = props.layer
    const [searchTexts, setSearchTexts] = useState<any>({
        company: "",
        medicine: "",
    })
    const setSearchText = (text: string) => {
        setSearchTexts(prevState => ({...prevState, [layer === "chooseCompany" ? "company" : "medicine"]: text}))
    }
    const [content, setContent] = useState<ContentState>({
        companies: [],
        medicines: [],
        medicineClass: [],
    })
    const whatToSearch = layer === "chooseCompany" ? "firmę" : "lek"
    const [companies, setCompanies] = useState<Array<any>>([])
    const [highlightedCompany, setHighlightedCompany] = useState<string>('')
    const [gotBackendData, setGotBackendData] = useState<boolean>(false);
    let onClickFunction:Function;
    switch (layer) {
        case "chooseCompany":
            onClickFunction = (obj: any) => {
                setParameters(prevState => ({...prevState, company: obj.name }))
                waitForResponseAndRender(setContent, {company: obj.name, medicine: ""});
            }
        break;
        case "chooseMedicine":
            onClickFunction = (obj: any) => {
                setParameters(prevState => ({...prevState, medicine: obj}))
                waitForResponseAndRender(setContent, {company: "", medicine: obj});
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
    const waitForResponseAndRender = (setContent: Function, params:any) => {
        setGotBackendData(false);
        if(layer === "chooseCompany") {
            fetch(backendAddress + '/medicines?' + new URLSearchParams({company: params.company}))
            .then((response) => {
                response.json().then(function(data) {
                setContent((content:any) => ({...content, medicines: data}));
                props.setLayer("chooseMedicine");
            });
            })
            .catch((err) => {
               console.log(err);
            });
        }
        if(layer === "chooseMedicine") {
            const searchParams = params.medicine.dose? new URLSearchParams({substance: params.medicine.substance, form: params.medicine.form, dose: params.medicine.dose}) : new URLSearchParams({substance: params.medicine.substance, form: params.medicine.form})
            fetch(backendAddress + '/group?' + searchParams)
            .then((response) => {
                response.json().then(function(data) {
                let newSet = new Set();
                makeDisplayDataFromMedicineClass(data).forEach((element: any) => {
                    newSet.add(element.company)
                })
                setCompanies(Array.from(newSet))
                setContent((prevState:ContentState) => ({...prevState, medicineClass: data.sort(compareMedicines)}));
                props.setLayer("viewMedicine");
            });
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }
    useEffect(() => {
        if(layer === "chooseCompany") {
            fetch(backendAddress + '/companies')
            .then((response) => {
                response.json().then(function(data) {
                setContent((prevState:ContentState) => ({...prevState, companies: makeCompanyObjects(data.companies.sort())}));
                setGotBackendData(true);
            })
            })
            .catch((err) => {
               console.log(err);
            });
        }
        else {
            setGotBackendData(true);
        }
        return () => {
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
                    value={searchTexts[layer === "chooseCompany" ? "company" : "medicine"]}
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
    const makeDisplayDataFromMedicineClass = (medicineClass: Array<Array<any>>) => {
        let displayData: Array<any> = [];
        medicineClass.forEach((element) => {
            displayData.push(element[element.length - 1])
        })
        return displayData;
    }
    const contentToDisplay = (layer: string) => {
        switch (layer) {
            case "chooseCompany":
                return content.companies;
            case "chooseMedicine":
                return content.medicines;
            case "viewMedicine":
                return makeDisplayDataFromMedicineClass(content.medicineClass);
            default:
                return [];
        }
    }
    const renderList = () => {
            return <List onClickFunction={onClickFunction} content={filter(contentToDisplay(layer), searchTexts[layer === "chooseCompany" ? "company" : "medicine"])} layer={layer} highlighted={highlightedCompany}/>
    }
    const previousPageButton = () => {
        if(layer === "chooseMedicine") {
            return (
                <div className="previousPageButton">
                <Button variant="contained" 
                    onClick={() => {setParameters((prevState:any) => ({...prevState, company: ""})); setSearchText(""); props.setLayer("chooseCompany"); }}
                >
                Powrót do poprzedniej strony
                </Button>
                </div>
            )
        }
        if(layer === "viewMedicine") {
            return (
                <div className="previousPageButton">
                <Button variant="contained" 
                    onClick={() => {setParameters((prevState:any) => ({...prevState, medicine: ""})); props.setLayer("chooseMedicine");}}
                >
                Powrót do poprzedniej strony
                </Button>
                </div>
            )
        }
        return <></>
    }
    return (
        <div className="Content">
            <div className="returnButton">
                <Button variant="contained" 
                    onClick={() => {
                        setParameters({company: "", medicine: ""}); 
                        props.setLayer("chooseCompany"); 
                        setContent((prevState:ContentState) => ({...prevState, medicineClass: [], medicines: []}));
                        setSearchTexts({company: "", medicine: ""});
                    }}
                >
                Powrót do strony głównej
                </Button>
            </div>
            {previousPageButton()}
            <div className="searchBar">
                
                {renderSearchBar()}
                {renderComboBox()}
            </div>
            <div className="table">
                {gotBackendData? <></> : <BlockLoader/>}
                {renderList()}
                {layer === "viewMedicine" ? <Graph medicineClass={content.medicineClass}/> : <></>}
            </div>
        </div>
    );
}
export default Content;