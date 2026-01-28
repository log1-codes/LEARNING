#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    for (int i = n; i >= 1; i--) {
        
        for (int s = 0; s < n - i; s++)
            cout << " ";
        
        for (int x = 0; x < i; x++) {
            cout << ".";
            if (x != i - 1) cout << " "; 
        }
        cout << endl;
    }


    for (int i = 2; i <= n; i++) {
       
        for (int s = 0; s < n - i; s++)
            cout << " ";
      
        for (int x = 0; x < i; x++) {
            cout << ".";
            if (x != i - 1) cout << " ";
        }
        cout << endl;
    }

    return 0;
}
