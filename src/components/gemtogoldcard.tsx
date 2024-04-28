import Image from 'next/image';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
export default function GemToGoldCard(props: any, index: number) {
    return (

        <div key={index}>
            <Card>
                <CardHeader title={props.item.uid} />
                <CardContent>
                    <Typography variant="body2" color="text.secondary" style={{ display: "flex" }}>
                        <Image src="/assets/Currencies/icon_global_gem.png" alt="Gold Icon" width={25} height={25} /> {props.item.gemsprice}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" style={{ display: "flex" }}>
                        <Image src="/assets/Currencies/icon_global_gold.png" alt="Gold Icon" width={25} height={25} /> {props.item.goldprice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" style={{ display: "flex" }}>
                        <Image src="/assets/Currencies/icon_global_gold.png" alt="Gold Icon" width={25} height={25} />/<Image src="/assets/Currencies/icon_global_gem.png" alt="Gold Icon" width={25} height={25} />
                        {props.item.ratio}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}