import { Box } from "@mui/material";
import React from "react";
import UATCGExport from "../components/UAExportTemplate";

const TestPage = () => {

    const currentUser = "ABCDEFGHIJKLMNOPQ"

    const data=[{cardid:'1-1-1',image:'/UD/HTR-2-001.webp',count:4,trigger:'none'},{cardid:'1-1-2',image:'/UD/HTR-2-002.webp',count:4,trigger:'none'},{cardid:'1-1-3',image:'/UD/HTR-2-003.webp',count:4,trigger:'none'}
    ,{cardid:'1-1-4',image:'/UD/HTR-2-004.webp',count:4,trigger:'none'},{cardid:'1-1-5',image:'/UD/HTR-2-005.webp',count:4,trigger:'none'},{cardid:'1-1-6',image:'/UD/HTR-2-006.webp',count:4,trigger:'none'}
    ,{cardid:'1-1-7',image:'/UD/HTR-2-007.webp',count:4,trigger:'none'},{cardid:'1-1-8',image:'/UD/HTR-2-008.webp',count:4,trigger:'Raid'},{cardid:'1-1-9',image:'/UD/HTR-2-009.webp',count:4,trigger:'none'}
    ,{cardid:'1-1-10',image:'/UD/HTR-2-010.webp',count:4,trigger:'none'},{cardid:'1-1-11',image:'/UD/HTR-2-011.webp',count:4,trigger:'none'},{cardid:'1-1-12',image:'/UD/HTR-2-012.webp',count:4,trigger:'none'}
    ,{cardid:'1-1-13',image:'/UD/HTR-2-013.webp',count:2,trigger:'none'}]

    return (
        <Box>
            <UATCGExport filteredCards={data} currentUser={currentUser}/>
        </Box>
    );
}

export default TestPage