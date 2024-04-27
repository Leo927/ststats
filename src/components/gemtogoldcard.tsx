import Image from 'next/image';
export default function GemToGoldCard(props: any, index: number) {
    return (
        <div key={index}>
            <div style={{ display: 'flex' }}>
                {props.item.tier} {props.item.tag1} {props.item.uid}
                offer <Image src="/assets/Currencies/icon_global_gem.png" alt="Gold Icon" width={25} height={25} /> {props.item.gemsprice}

                request <Image src="/assets/Currencies/icon_global_gold.png" alt="Gold Icon" width={25} height={25} /> {props.item.goldprice}

                <Image src="/assets/Currencies/icon_global_gold.png" alt="Gold Icon" width={25} height={25} />/<Image src="/assets/Currencies/icon_global_gem.png" alt="Gold Icon" width={25} height={25} />
                {props.item.ratio}
            </div>
        </div>
    );
}