import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import './List.css';
export interface TableProps {
    content: Array<any>
    layer?: "chooseCompany" | "chooseMedicine" | "viewMedicine"
    onClickFunction?: Function
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
                return ["name"]
            default:
                return ["name"]
        }
    }
    const layerHeaders = (layer: "chooseCompany" | "chooseMedicine" | "viewMedicine") => {
        switch (layer) {
            case "chooseCompany":
                return ["name", "id"]
            case "chooseMedicine":
                return ["name", "id"]
            case "viewMedicine":
                return ["name", "id"]
        }
    }
    const displayNames = {
        name: (props.layer === "chooseCompany" ? "Nazwa firmy" : "Nazwa leku"),
        id: "ID",
    }
    const displayName = (header: string) => header in displayNames ? displayNames[header as keyof typeof displayNames] : header
    const headers = props.layer ? layerHeaders(props.layer) : Object.keys(props.content[0])
    const renderTableHead = () => {
        return headers.map((header:string, index) => {
            return <TableCell key={index}>{displayName(header)}</TableCell>
        })
    }
    const renderTableRow = (element: any) => {
        return headers.map((header, index) => {
            return (
                clickable().includes(header) ?
                <TableCell key={index}><div className="clickable" onClick={() => onClickFunction(header)}>{element[header]}</div></TableCell> :
                <TableCell key={index}>{element[header]}</TableCell>     
            )
        })
    }
    const renderTableBody = () => {
        return props.content.map((element, index) => {
            return <TableRow key={index}>{renderTableRow(element)}</TableRow>
        })
    }
    return (
        <div className="Table">
           <Table sx={{ minWidth: 650 }} aria-label="simple table">
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