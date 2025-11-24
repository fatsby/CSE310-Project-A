import { Carousel } from '@mantine/carousel'
import ItemCard from '../ItemCard'

function ItemsRow({ title, itemsArray }) {
    return (
        <div className="pt-10">
            <h1 className="font-bold text-3xl text-slate-800 mb-6 border-l-4 border-[#5174f0] pl-4">
                {title}
            </h1>
            <Carousel
                slideSize="25%"
                slideGap="sm"
                controlsOffset="xs"
                controlSize={26}
                withControls
                withIndicators={false}
                loop
                emblaOptions={{ dragFree: true, align: 'start' }}
            >
                {itemsArray.map((item) => (
                    <Carousel.Slide
                        className="drop-shadow-md py-4"
                        key={item.id}
                    >
                        <ItemCard itemData={item} />
                    </Carousel.Slide>
                ))}
            </Carousel>
        </div>
    )
}

export default ItemsRow
