
export class GamepadHandler {
    private readonly deadzone = 0.25;

    poll(keyMap: Record<string, () => void>): void {
        const gamepads = navigator.getGamepads();

        for (const gamepad of gamepads) {
            if (!gamepad || !gamepad.connected) continue;

            const controls: [string, boolean][] = [
                // D-pad
                ["DPadUp", !!gamepad.buttons[12]?.pressed],
                ["DPadRight", !!gamepad.buttons[15]?.pressed],
                ["DPadDown", !!gamepad.buttons[13]?.pressed],
                ["DPadLeft", !!gamepad.buttons[14]?.pressed],

                // Left joystick
                ["LeftJoystickY-", (gamepad.axes[1] ?? 0) < -this.deadzone],
                ["LeftJoystickX+", (gamepad.axes[0] ?? 0) > this.deadzone],
                ["LeftJoystickY+", (gamepad.axes[1] ?? 0) > this.deadzone],
                ["LeftJoystickX-", (gamepad.axes[0] ?? 0) < -this.deadzone],

                // Right joystick
                ["RightJoystickX-", (gamepad.axes[3] ?? 0) < -this.deadzone],
                ["RightJoystickY+", (gamepad.axes[2] ?? 0) > this.deadzone],
                ["RightJoystickY+", (gamepad.axes[3] ?? 0) > this.deadzone],
                ["RightJoystickX-", (gamepad.axes[2] ?? 0) < -this.deadzone],
            ];

            for (const [key, pressed] of controls) {
                if (pressed) {
                    keyMap[key]?.();
                }
            }
        }
    }
}
