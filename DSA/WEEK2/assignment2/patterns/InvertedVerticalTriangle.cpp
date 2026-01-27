#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    int rows = 2 * n - 1;

    for (int i = 0; i < rows; i++) {
        int right_col = min(i, rows - 1 - i);

        for (int j = 0; j <= right_col; j++) {
            if (j == 0 || j == right_col)
                cout << "* ";
            else
                cout << " ";
        }
        cout << '\n';
    }

    return 0;
}
