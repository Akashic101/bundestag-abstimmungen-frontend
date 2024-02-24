import React from 'react';
import SpecificMember from './components/SpecificMember/SpecificMember.tsx'
import TopTen from './components/TopTen/TopTen.tsx'
import '@mantine/charts/styles.css';
import { Divider } from '@mantine/core';

function App() {
    return (
        <div className='root'>
        <TopTen />
        <Divider my="md" />
        <SpecificMember />
        </div>
    );
}

export default App;
