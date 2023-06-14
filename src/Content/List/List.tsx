import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';
import './List.css';
export interface TableProps {
    content: Array<any>
    layer?: "chooseCompany" | "chooseMedicine" | "viewMedicine"
    onClickFunction?: Function
    highlighted?: string
}
function List(props: TableProps) {
    const onClickFunction = props.onClickFunction ? props.onClickFunction : () => {console.log("No onClickFunction provided")};
    const clickable = () => {
        switch (props.layer) {
            case "chooseCompany":
                return ["name"]
            case "chooseMedicine":
                return ["name"]
            case "viewMedicine":
                return []
            default:
                return ["name"]
        }
    }
    const layerHeaders = (layer: "chooseCompany" | "chooseMedicine" | "viewMedicine") => {
        switch (layer) {
            case "chooseCompany":
                return ["name"]
            case "chooseMedicine":
                return ["name", "dose", "form", "substance"]
            case "viewMedicine":
                return ["name", "dose", "form", "substance", "company", "contents", "amount", "unit", "price", "price_per_unit"]

        }
    }
    const highlightedHeader = "company"
    const displayNames = {
        name: (props.layer === "chooseCompany" ? "Nazwa firmy" : "Nazwa leku"),
        dose: "Dawka",
        form: "Postać",
        substance: "Substancja czynna",
        company: "Firma",
        contents: "Zawartość",
        amount: "Ilość",
        unit: "Jednostka",
        price: "Cena",
        price_per_unit: "Cena za jednostkę"
    }
    const displayName = (header: string) => header in displayNames ? displayNames[header as keyof typeof displayNames] : header
    const headers = props.layer ? layerHeaders(props.layer) : Object.keys(props.content[0])
    const CustomMarginCell = styled(TableCell)`
    margin: 0;
    padding: 20px min(0.4vw, 10px);
    `;
    const renderTableHead = () => {
        return headers.map((header:string, index) => {
            return <CustomMarginCell key={index} className="tableCell"><span className="tableText">{displayName(header)}</span></CustomMarginCell>
        })
    }
    const renderTableRow = (element: any) => {
        return headers.map((header, index) => {
            return (
                clickable().includes(header) ?
                <CustomMarginCell 
                    key={index}
                    className="tableCell"
                >
                    <div className="clickable" onClick={() => onClickFunction(element)}>
                        <span className="tableText">{element[header]}</span>
                    </div>
                </CustomMarginCell> :
                <CustomMarginCell key={index} className="tableCell"><span className="tableText">{element[header]}</span></CustomMarginCell>     
            )
        })
    }
    const renderTableBody = () => {
        return props.content.map((element, index) => {
            if(props.highlighted && element[highlightedHeader] === props.highlighted)
            return <TableRow key={index} className="highlighted">{renderTableRow(element)}</TableRow>
            else
            return <TableRow key={index}>{renderTableRow(element)}</TableRow>
        })
    }
    return (
        <div className="Table">
           <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {renderTableHead()}
          </TableRow>
        </TableHead>
        <TableBody>
            {renderTableBody()}
        </TableBody>
      </Table>
        </div>
    );
}
export default List;