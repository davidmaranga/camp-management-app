import React, { useState } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';
import { Registration, Map, Map3d, Tracker } from './screens';
import { Alert } from './components/elements';
import { MapContext } from './contexts';
import './scss/App.scss';

// Alert configuration
const alertOptions = {
  position: 'bottom right',
  timeout: 3000,
  offset: '0 20px 10px',
  transition: 'scale',
};

if (!JSON.parse(localStorage.getItem('users'))) {
  // Set static dummy data of users
  localStorage.setItem(
    'users',
    JSON.stringify([
      {
        id: 906603366813,
        firstName: 'Matthew',
        lastName: 'Frick',
        birthDate: '07/01/1977',
        sex: 'Male',
        homeAddress: 'N. Domingo Street',
        contactNumber: '09990',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 381242580571,
        firstName: 'Thomas',
        lastName: 'Ferry',
        birthDate: '05/17/1970',
        sex: 'Female',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '09991',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1494706225701,
        firstName: 'Paul',
        lastName: 'Quizoz',
        birthDate: '03/23/1990',
        sex: 'Male',
        homeAddress: 'F. Antonio 0',
        contactNumber: '09992',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 24542271035,
        firstName: 'Otto',
        lastName: 'Cast',
        birthDate: '06/20/1992',
        sex: 'Female',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '09993',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 163263136815,
        firstName: 'Monte',
        lastName: 'Bateman',
        birthDate: '02/03/1969',
        sex: 'Male',
        homeAddress: 'Alfonso XIII',
        contactNumber: '09994',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 473353417850,
        firstName: 'Matthew',
        lastName: 'Ortiz',
        birthDate: '03/24/1992',
        sex: 'Male',
        homeAddress: 'Alfonso XIII',
        contactNumber: '09995',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 957265248221,
        firstName: 'Otto',
        lastName: 'Bauer',
        birthDate: '12/23/1986',
        sex: 'Male',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '09996',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 928722634832,
        firstName: 'Adam',
        lastName: 'Bauer',
        birthDate: '03/20/2000',
        sex: 'Female',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '09997',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 968504573392,
        firstName: 'Aaron',
        lastName: 'Christensen',
        birthDate: '04/17/1965',
        sex: 'Female',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '09998',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1538372195270,
        firstName: 'Edward',
        lastName: 'Ramachandran',
        birthDate: '06/08/1963',
        sex: 'Female',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '09999',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 231359547906,
        firstName: 'Otto',
        lastName: 'Sandstrom',
        birthDate: '07/15/2000',
        sex: 'Male',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '099910',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1030148692494,
        firstName: 'George',
        lastName: 'Sandstrom',
        birthDate: '01/21/1977',
        sex: 'Male',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '099911',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 133409152348,
        firstName: 'Larry',
        lastName: 'Ingram',
        birthDate: '02/20/1987',
        sex: 'Female',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '099912',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1144757497217,
        firstName: 'Alex',
        lastName: 'Fietzer',
        birthDate: '09/11/1964',
        sex: 'Female',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099913',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1611122841819,
        firstName: 'Roger',
        lastName: 'Eastman',
        birthDate: '02/10/1995',
        sex: 'Male',
        homeAddress: 'P. Bernardo Street',
        contactNumber: '099914',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 950503991743,
        firstName: 'George',
        lastName: 'Moody',
        birthDate: '02/26/2002',
        sex: 'Male',
        homeAddress: 'N. Domingo Street',
        contactNumber: '099915',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 278444166760,
        firstName: 'Peter',
        lastName: 'Jurgenson',
        birthDate: '01/14/1996',
        sex: 'Male',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '099916',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 115312463195,
        firstName: 'Fred',
        lastName: 'Yocum',
        birthDate: '02/12/1992',
        sex: 'Male',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099917',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1457648389206,
        firstName: 'Roger',
        lastName: 'Nugent',
        birthDate: '10/13/1981',
        sex: 'Female',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '099918',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 415945138626,
        firstName: 'John',
        lastName: 'Trussel',
        birthDate: '11/10/1960',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099919',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 837056029990,
        firstName: 'Thomas',
        lastName: 'Trusela',
        birthDate: '05/20/1998',
        sex: 'Female',
        homeAddress: 'Gil Fernando Avenue 0',
        contactNumber: '099920',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1218002245706,
        firstName: 'David',
        lastName: 'Reamer',
        birthDate: '08/14/1977',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099921',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 461549023040,
        firstName: 'Larry',
        lastName: 'Deitz',
        birthDate: '02/21/1982',
        sex: 'Female',
        homeAddress: 'Gil Fernando Avenue 0',
        contactNumber: '099922',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 908738991924,
        firstName: 'Monte',
        lastName: 'Aikin',
        birthDate: '02/19/1964',
        sex: 'Female',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '099923',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1153649400939,
        firstName: 'Ike',
        lastName: 'Lewis',
        birthDate: '02/17/1988',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099924',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 721984229753,
        firstName: 'Hal',
        lastName: 'Ortiz',
        birthDate: '07/19/1990',
        sex: 'Female',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099925',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 594318217596,
        firstName: 'Matthew',
        lastName: 'Wagner',
        birthDate: '10/13/1980',
        sex: 'Male',
        homeAddress: 'N. Domingo Street',
        contactNumber: '099926',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 124833024797,
        firstName: 'Fred',
        lastName: 'Woo',
        birthDate: '07/04/1966',
        sex: 'Female',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '099927',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1387073197470,
        firstName: 'Hal',
        lastName: 'Nelson',
        birthDate: '08/05/1961',
        sex: 'Male',
        homeAddress: 'P. Bernardo Street',
        contactNumber: '099928',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1303650252791,
        firstName: 'Joe',
        lastName: 'Ingram',
        birthDate: '06/24/1996',
        sex: 'Female',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099929',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1298295567471,
        firstName: 'Thomas',
        lastName: 'Hesch',
        birthDate: '03/11/1979',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099930',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 121712147541,
        firstName: 'Aaron',
        lastName: 'Lawless',
        birthDate: '08/04/1976',
        sex: 'Female',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '099931',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1105228615693,
        firstName: 'Adam',
        lastName: 'Fletcher',
        birthDate: '01/16/1981',
        sex: 'Female',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099932',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1390602478408,
        firstName: 'John',
        lastName: 'Ostrander',
        birthDate: '06/03/1965',
        sex: 'Female',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '099933',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 182532613686,
        firstName: 'Mark',
        lastName: 'Uflan',
        birthDate: '02/20/1983',
        sex: 'Female',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '099934',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1152559800323,
        firstName: 'Adam',
        lastName: 'Lawless',
        birthDate: '01/02/1973',
        sex: 'Male',
        homeAddress: 'F. Antonio 0',
        contactNumber: '099935',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 798679119872,
        firstName: 'Fred',
        lastName: 'Moore',
        birthDate: '10/30/1991',
        sex: 'Male',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099936',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1403911560195,
        firstName: 'Joe',
        lastName: 'Van Zandt',
        birthDate: '11/15/1987',
        sex: 'Female',
        homeAddress: 'N. Domingo Street',
        contactNumber: '099937',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 313575152001,
        firstName: 'Nathan',
        lastName: 'Dinkins',
        birthDate: '10/02/1982',
        sex: 'Male',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099938',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 221138609966,
        firstName: 'Mark',
        lastName: 'Sandstrom',
        birthDate: '08/02/1970',
        sex: 'Male',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '099939',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1275507877023,
        firstName: 'Paul',
        lastName: 'Leisinger',
        birthDate: '07/17/1992',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099940',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 705797419766,
        firstName: 'Fred',
        lastName: 'Jenson',
        birthDate: '06/19/1966',
        sex: 'Female',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099941',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1292636286034,
        firstName: 'Jack',
        lastName: 'Hesch',
        birthDate: '05/01/1960',
        sex: 'Male',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '099942',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 700201622916,
        firstName: 'Mark',
        lastName: 'Norquist',
        birthDate: '08/07/1986',
        sex: 'Male',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '099943',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 932884600266,
        firstName: 'Matthew',
        lastName: 'Soloman',
        birthDate: '07/13/1966',
        sex: 'Male',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099944',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 576983198798,
        firstName: 'Steve',
        lastName: 'Vanderpoel',
        birthDate: '03/06/1961',
        sex: 'Female',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099945',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 147781978794,
        firstName: 'Roger',
        lastName: 'Reamer',
        birthDate: '11/03/1969',
        sex: 'Female',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099946',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 631076755253,
        firstName: 'Larry',
        lastName: 'Cast',
        birthDate: '08/29/1961',
        sex: 'Female',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099947',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 309236885756,
        firstName: 'Dan',
        lastName: 'Moore',
        birthDate: '06/08/1963',
        sex: 'Male',
        homeAddress: 'P. Bernardo Street',
        contactNumber: '099948',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 559244378659,
        firstName: 'Mark',
        lastName: 'Schmitt',
        birthDate: '10/14/1998',
        sex: 'Female',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099949',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 196153616898,
        firstName: 'Jack',
        lastName: 'Doran',
        birthDate: '05/24/1965',
        sex: 'Male',
        homeAddress: 'N. Domingo Street',
        contactNumber: '099950',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1544131115081,
        firstName: 'Otto',
        lastName: 'Ortiz',
        birthDate: '11/24/1973',
        sex: 'Female',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099951',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 239283683569,
        firstName: 'Frank',
        lastName: 'Ostrander',
        birthDate: '06/12/1973',
        sex: 'Female',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099952',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1526221854888,
        firstName: 'Thomas',
        lastName: 'Woo',
        birthDate: '10/02/1994',
        sex: 'Female',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099953',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 690872010855,
        firstName: 'Peter',
        lastName: 'Nugent',
        birthDate: '01/14/2002',
        sex: 'Female',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '099954',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 879353164702,
        firstName: 'Otto',
        lastName: 'Root',
        birthDate: '02/09/1991',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099955',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 617800969706,
        firstName: 'Alex',
        lastName: 'Celedon',
        birthDate: '06/29/2001',
        sex: 'Male',
        homeAddress: 'P. Bernardo Street',
        contactNumber: '099956',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1123018486995,
        firstName: 'Hal',
        lastName: 'Leisinger',
        birthDate: '07/12/1992',
        sex: 'Female',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099957',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 434480469606,
        firstName: 'Steve',
        lastName: 'Davis',
        birthDate: '12/07/1974',
        sex: 'Female',
        homeAddress: 'P. Bernardo Street',
        contactNumber: '099958',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1307522601091,
        firstName: 'Nathan',
        lastName: 'Upson',
        birthDate: '11/06/1965',
        sex: 'Male',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '099959',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1608041237605,
        firstName: 'Peter',
        lastName: 'Van Zandt',
        birthDate: '08/08/1981',
        sex: 'Female',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '099960',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1434104367693,
        firstName: 'Nathan',
        lastName: 'Ostrander',
        birthDate: '10/30/1979',
        sex: 'Male',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099961',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 528881487770,
        firstName: 'Thomas',
        lastName: 'Wagle',
        birthDate: '08/15/1999',
        sex: 'Female',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '099962',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 258321293732,
        firstName: 'David',
        lastName: 'Cataldi',
        birthDate: '04/07/1969',
        sex: 'Male',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099963',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 375449216001,
        firstName: 'Ty',
        lastName: 'Dewalt',
        birthDate: '01/14/2002',
        sex: 'Female',
        homeAddress: 'F. Antonio 0',
        contactNumber: '099964',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 723076357827,
        firstName: 'Ike',
        lastName: 'Knutson',
        birthDate: '01/14/1987',
        sex: 'Female',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099965',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1160032341801,
        firstName: 'Joe',
        lastName: 'Van Zandt',
        birthDate: '04/04/1967',
        sex: 'Male',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099966',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 494564438291,
        firstName: 'Alex',
        lastName: 'Rice',
        birthDate: '12/03/1996',
        sex: 'Male',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099967',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 127370956333,
        firstName: 'Steve',
        lastName: 'Upson',
        birthDate: '02/28/1970',
        sex: 'Male',
        homeAddress: 'F. Antonio 0',
        contactNumber: '099968',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 96376016078,
        firstName: 'Matthew',
        lastName: 'Deitz',
        birthDate: '11/11/1966',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099969',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 628044036686,
        firstName: 'Edward',
        lastName: 'Bowers',
        birthDate: '10/21/1980',
        sex: 'Female',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099970',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1201567664670,
        firstName: 'Carl',
        lastName: 'Vanderpoel',
        birthDate: '09/26/1996',
        sex: 'Female',
        homeAddress: 'Gil Fernando Avenue 0',
        contactNumber: '099971',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1185211042633,
        firstName: 'Ben',
        lastName: 'Jurgenson',
        birthDate: '03/10/1993',
        sex: 'Female',
        homeAddress: 'Gil Fernando Avenue 0',
        contactNumber: '099972',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 160732987937,
        firstName: 'Carl',
        lastName: 'Ulrich',
        birthDate: '03/12/1971',
        sex: 'Male',
        homeAddress: 'N. Domingo Street',
        contactNumber: '099973',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1607411510902,
        firstName: 'Larry',
        lastName: 'Anderson',
        birthDate: '05/11/1961',
        sex: 'Female',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '099974',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 69484979019,
        firstName: 'Peter',
        lastName: 'LePage',
        birthDate: '09/15/1985',
        sex: 'Male',
        homeAddress: 'L. P. Leviste Street',
        contactNumber: '099975',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1159971247350,
        firstName: 'Roger',
        lastName: 'Ramachandran',
        birthDate: '12/08/1963',
        sex: 'Female',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099976',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1259746497878,
        firstName: 'George',
        lastName: 'Soulis',
        birthDate: '02/18/1985',
        sex: 'Female',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '099977',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1610078651278,
        firstName: 'Walter',
        lastName: 'Dugan',
        birthDate: '11/14/1964',
        sex: 'Male',
        homeAddress: 'Carlos Palanca Street',
        contactNumber: '099978',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1084996625958,
        firstName: 'Nathan',
        lastName: 'Schwager',
        birthDate: '05/02/1989',
        sex: 'Female',
        homeAddress: 'Gil Fernando Avenue 0',
        contactNumber: '099979',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 802132174595,
        firstName: 'Alex',
        lastName: 'Yates',
        birthDate: '08/09/1975',
        sex: 'Male',
        homeAddress: 'P. Bernardo Street',
        contactNumber: '099980',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 772834033284,
        firstName: 'Adam',
        lastName: 'LePage',
        birthDate: '10/17/1998',
        sex: 'Male',
        homeAddress: 'F. Antonio 0',
        contactNumber: '099981',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1447205138062,
        firstName: 'Matthew',
        lastName: 'Roberts',
        birthDate: '03/15/1966',
        sex: 'Female',
        homeAddress: 'Gil Fernando Avenue 0',
        contactNumber: '099982',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 30762393329,
        firstName: 'Fred',
        lastName: 'Myers',
        birthDate: '04/09/2001',
        sex: 'Female',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '099983',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 179054083083,
        firstName: 'Edward',
        lastName: 'Upson',
        birthDate: '02/05/1976',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099984',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 203200549916,
        firstName: 'Steve',
        lastName: 'Lawless',
        birthDate: '04/26/2000',
        sex: 'Female',
        homeAddress: 'F. Antonio 0',
        contactNumber: '099985',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 6688506132,
        firstName: 'Peter',
        lastName: 'Ramachandran',
        birthDate: '12/29/1961',
        sex: 'Female',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099986',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 555442166437,
        firstName: 'John',
        lastName: 'Johnsen',
        birthDate: '03/30/1985',
        sex: 'Male',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099987',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1205383676795,
        firstName: 'Nathan',
        lastName: 'Duffman',
        birthDate: '02/12/1965',
        sex: 'Male',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099988',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 1290631794871,
        firstName: 'Steve',
        lastName: 'Ferry',
        birthDate: '04/01/1997',
        sex: 'Female',
        homeAddress: 'Macario Asistio, Sr. Avenue',
        contactNumber: '099989',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1054742511094,
        firstName: 'John',
        lastName: 'Vader',
        birthDate: '02/19/1982',
        sex: 'Male',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099990',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 651406694005,
        firstName: 'Nathan',
        lastName: 'Linde',
        birthDate: '09/15/1980',
        sex: 'Female',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099991',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 718911626588,
        firstName: 'Ty',
        lastName: 'Aikin',
        birthDate: '01/29/1995',
        sex: 'Male',
        homeAddress: 'Gil Fernando Avenue 0',
        contactNumber: '099992',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 72037772165,
        firstName: 'David',
        lastName: 'McGinnis',
        birthDate: '07/23/1992',
        sex: 'Female',
        homeAddress: 'J. Escrivà Drive',
        contactNumber: '099993',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1175285508492,
        firstName: 'Paul',
        lastName: 'Weinstein',
        birthDate: '01/18/1997',
        sex: 'Female',
        homeAddress: 'Gil Fernando Avenue 0',
        contactNumber: '099994',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 578012784414,
        firstName: 'Nathan',
        lastName: 'Jenson',
        birthDate: '10/06/1979',
        sex: 'Female',
        homeAddress: 'F. Antonio 0',
        contactNumber: '099995',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 945231705193,
        firstName: 'Joe',
        lastName: 'Moore',
        birthDate: '07/20/1979',
        sex: 'Male',
        homeAddress: 'Monte de Piedad Street',
        contactNumber: '099996',
        dateRegistered: 1633590467,
        userType: 'Personnel',
      },

      {
        id: 945840500716,
        firstName: 'Matthew',
        lastName: 'Schwager',
        birthDate: '04/02/1988',
        sex: 'Female',
        homeAddress: 'F. Antonio 0',
        contactNumber: '099997',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 1151921008449,
        firstName: 'Adam',
        lastName: 'Nuttle',
        birthDate: '07/28/1973',
        sex: 'Male',
        homeAddress: 'Alfonso XIII',
        contactNumber: '099998',
        dateRegistered: 1633,
        userType: 'Visitor',
      },

      {
        id: 13394989067,
        firstName: 'Frank',
        lastName: 'Kaskel',
        birthDate: '11/04/1994',
        sex: 'Male',
        homeAddress: 'Mayor Ignacio Santos Diaz Street',
        contactNumber: '099999',
        dateRegistered: 1633,
        userType: 'Visitor',
      },
    ])
  );
}

if (!JSON.parse(localStorage.getItem('gpsDevices'))) {
  // Set static dummy data of gpsDevices
  localStorage.setItem(
    'gpsDevices',
    JSON.stringify([
      {
        id: 'GPS-00001',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-00002',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-00003',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-00004',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-00005',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-00006',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-00007',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-00008',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-00009',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000010',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000011',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000012',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000013',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000014',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000015',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000016',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000017',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000018',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000019',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000020',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000021',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000022',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000023',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000024',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000025',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000026',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000027',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000028',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000029',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000030',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000031',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000032',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000033',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000034',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000035',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000036',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000037',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000038',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000039',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000040',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000041',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000042',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000043',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000044',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000045',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000046',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000047',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000048',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000049',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000050',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000051',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000052',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000053',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000054',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000055',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000056',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000057',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000058',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000059',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000060',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000061',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000062',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000063',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000064',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000065',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000066',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000067',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000068',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000069',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000070',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000071',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000072',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000073',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000074',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000075',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000076',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000077',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000078',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000079',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000080',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000081',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000082',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000083',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000084',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000085',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000086',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000087',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000088',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000089',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000090',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000091',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000092',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000093',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000094',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000095',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000096',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000097',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000098',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-000099',
        userID: null,
        type: null,
      },

      {
        id: 'GPS-0000100',
        userID: null,
        type: null,
      },
    ])
  );
}

if (!JSON.parse(localStorage.getItem('histories'))) {
  // Set static dummy data of histories
  localStorage.setItem('histories', JSON.stringify([]));
}

if (!JSON.parse(localStorage.getItem('userLocations'))) {
  // Set static dummy data of userLocations
  localStorage.setItem('userLocations', JSON.stringify([]));
}

if (!JSON.parse(localStorage.getItem('vehicleLocations'))) {
  // Set static dummy data of vehicleLocations
  localStorage.setItem('vehicleLocations', JSON.stringify([]));
}

if (!JSON.parse(localStorage.getItem('warnings'))) {
  // Set static dummy data of warnings
  localStorage.setItem('warnings', JSON.stringify([]));
}

/* eslint-disable react/jsx-props-no-spreading */
const App = () => {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem('users')) || []
  );
  const [gpsDevices, setGpsDevices] = useState(
    JSON.parse(localStorage.getItem('gpsDevices') || [])
  );
  const [histories, setHistories] = useState(
    JSON.parse(localStorage.getItem('histories') || [])
  );
  const [userLocations, setUserLocations] = useState(
    JSON.parse(localStorage.getItem('userLocations') || [])
  );
  const [vehicleLocations, setVehicleLocations] = useState(
    JSON.parse(localStorage.getItem('vehicleLocations') || [])
  );
  const [warnings, setWarnings] = useState(
    JSON.parse(localStorage.getItem('warnings') || [])
  );

  const updateUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const updateGpsDevices = (newGpsDevices) => {
    setGpsDevices(newGpsDevices);
    localStorage.setItem('gpsDevices', JSON.stringify(newGpsDevices));
  };

  const updateHistories = (newHistories) => {
    setHistories(newHistories);
    localStorage.setItem('histories', JSON.stringify(newHistories));
  };

  const updateUserLocations = (newUserLocations) => {
    setUserLocations(newUserLocations);
    localStorage.setItem('userLocations', JSON.stringify(newUserLocations));
  };

  const updateVehicleLocations = (newVehicleLocations) => {
    setVehicleLocations(newVehicleLocations);
    localStorage.setItem(
      'vehicleLocations',
      JSON.stringify(newVehicleLocations)
    );
  };

  const updateWarnings = (newWarnings) => {
    setWarnings(newWarnings);
    localStorage.setItem('warnings', JSON.stringify(newWarnings));
  };

  return (
    <BrowserRouter basename="/">
      <React.Suspense fallback={<div>Loading...</div>}>
        <MapContext.Provider
          value={{
            users,
            updateUsers,
            gpsDevices,
            updateGpsDevices,
            histories,
            updateHistories,
            userLocations,
            updateUserLocations,
            vehicleLocations,
            updateVehicleLocations,
            warnings,
            updateWarnings,
          }}
        >
          <AlertProvider template={Alert} {...alertOptions}>
            <Switch>
              <Route
                path="/registration"
                name="Registration"
                render={(props) => <Registration {...props} />}
              />

              <Route
                path="/map"
                name="Map"
                render={(props) => <Map {...props} />}
              />

              <Route
                path="/map3d"
                name="Map3d"
                render={(props) => <Map3d {...props} />}
              />

              <Route
                path="/tracker"
                name="Tracker"
                render={(props) => <Tracker {...props} />}
              />

              <Redirect to="/page-not-found" />
            </Switch>
          </AlertProvider>
        </MapContext.Provider>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
