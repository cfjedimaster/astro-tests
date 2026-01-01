---
title: Zebra stripe a table
tags: ["tables"]
---

<style>
/* just to make it easier to see */
table {
    width: 500px;
}

tbody tr {
  background-color: #0a5b20;
}

tbody tr:nth-child(even) {
  background-color: #000000; 
}
</style>

<table>
    <thead>
    <tr>
        <td>Name</td>
        <td>Age</td>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Luna</td>
        <td>13</td>
    </tr>
    <tr>
        <td>Elise</td>
        <td>15</td>
    </tr>
    <tr>
        <td>Pig</td>
        <td>10</td>
    </tr>
    <tr>
        <td>Zelda</td>
        <td>2</td>
    </tr>
    </tbody>
</table>