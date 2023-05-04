import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
export interface TableProps {
    content: Array<any>
    layer?: "chooseCompany" | "chooseMedicine" | "viewMedicine"
}
function List(props: TableProps) {
    const layerHeaders = (layer: "chooseCompany" | "chooseMedicine" | "viewMedicine") => {
        switch (layer) {
            case "chooseCompany":
                return ["name", "id"]
            case "chooseMedicine":
                return ["lek", "id"]
            case "viewMedicine":
                return ["name", "id"]
        }
    }
    const headers = props.layer ? layerHeaders(props.layer) : Object.keys(props.content[0])
    const renderTableHead = () => {
        return headers.map((header, index) => {
            return <TableCell key={index}>{header.charAt(0).toUpperCase() + header.slice(1)}</TableCell>
        })
    }
    const renderTableRow = (element: any) => {
        return headers.map((header, index) => {
            return <TableCell key={index}>{element[header]}</TableCell>
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