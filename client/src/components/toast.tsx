import React from 'react';

import { Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";

import { Toast as ToastState } from "../state/toast";
import { useSetRecoilState } from "recoil";
import { recoilRemoveToast } from "../state/app.state";

const AUTO_HIDE_DURATION = 3000; // 3 seconds

export function Toast({ toast }: { toast: ToastState }) {
    const removeToast = useSetRecoilState(recoilRemoveToast);

    // Transition component per MUI example
    function TransitionComponent(
        props: TransitionProps & { children: React.ReactElement<any, any> }
    ) {
        return <Slide {...props} direction="up" />;
    }

    return (
        <Snackbar
            key={toast.uuid}
            open={true}
            autoHideDuration={AUTO_HIDE_DURATION}
            onClose={() => removeToast(toast.uuid)}
            message={toast.message}
            slots={{ transition: TransitionComponent }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
    );
};