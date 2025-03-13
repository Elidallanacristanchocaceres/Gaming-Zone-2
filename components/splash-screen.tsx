"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const SplashScreen = () => {
return (
    <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.2 }}
    transition={{ duration: 0.5 }}

    >
    <Image
        src="/assets/ima.png" // Asegúrate de que la imagen tenga fondo transparente
        alt="Variety Games Logo"
        width={300}
        height={300}
        className="drop-shadow-lg"
        priority
    />
    </motion.div>
);
};

export default SplashScreen;
