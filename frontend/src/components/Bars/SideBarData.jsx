import React from "react";
import { IoHome, IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { RiAdvertisementFill } from "react-icons/ri";

export const SideBarData = [
    {
        title: 'דף הבית',
        action: 'homepage',
        icon: <IoHome />,
        cName: 'nav-text'
    },
    {
        title: 'מודעות נדל"ן להשכרה',
        action: 'AllAds',
        icon: <RiAdvertisementFill />,
        cName: 'nav-text'
    },
    {
        title: 'המודעות שלי',
        action: 'MyAds',
        icon: <RiAdvertisementFill />,
        cName: 'nav-text'
    },
    {
        title: 'עדכון פרטי משתמש',
        action: 'UpdateUserDetails',
        icon: <FaUser />,
        cName: 'nav-text'
    },
    {
        title: 'התנתק',
        path: '/auth',
        icon: <IoLogOutOutline />,
        cName: 'nav-text'
    },
];