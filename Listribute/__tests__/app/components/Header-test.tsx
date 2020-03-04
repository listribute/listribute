import React from "react";
import "react-native";
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import Header from "../../../app/components/Header";

it("renders component correctly", () => {
    renderer.create(<Header />);
});

it("calls callback when back button is pressed", async () => {
    const callback = jest.fn();
    let header: ReactTestRenderer;
    await act(async () => {
        header = renderer.create(<Header onBackButton={callback} />);
    });

    // Simulate back button press
    header!.root.find(n => n.props.leftComponent).props.leftComponent.onPress();

    expect(callback).toBeCalled();
});
