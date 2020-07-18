import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

class RCSTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { data, head, body } = this.props;
    return (
      <Table>
        <TableHead>
          <TableRow>{head(TableCell)}</TableRow>
        </TableHead>
        <TableBody>
          {data.map((d, index) => (
            <TableRow key={index}>{body(d, TableCell)}</TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default RCSTable;
